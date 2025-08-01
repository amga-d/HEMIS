var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');
const { generateAndSaveInsights } = require('../services/geminiInsights');
const insightScheduler = require('../services/insightScheduler');
const INSIGHT_FRESHNESS_HOURS = 24; // Changed from 2 to 24 hours

/* GET forecast data */
router.get('/forecast/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { hospitalId } = req.query;

    // Try to get real forecast data from database first
    const dbForecastData = await prisma.forecastData.findMany({
      where: {
        hospitalId,
        forecastType: type.toUpperCase().replace('-', '_'),
      },
      orderBy: {
        periodDate: 'asc',
      },
      take: 12,
    });

    if (dbForecastData.length > 0) {
      const formattedData = dbForecastData.map((item) => ({
        month: item.periodDate.toLocaleDateString('en-US', { month: 'short' }),
        historical: item.historicalValue
          ? parseFloat(item.historicalValue)
          : null,
        forecast: item.forecastValue ? parseFloat(item.forecastValue) : null,
        confidence:
          item.confidenceLower && item.confidenceUpper
            ? {
                lower: parseFloat(item.confidenceLower),
                upper: parseFloat(item.confidenceUpper),
              }
            : null,
      }));
      return res.json(formattedData);
    }

    // Fallback to simulated data if no database data
    let forecastData = [];

    switch (type) {
      case 'patient-inflow':
        forecastData = [
          { month: 'Jul', historical: 1500, forecast: null, confidence: null },
          { month: 'Aug', historical: 1600, forecast: null, confidence: null },
          { month: 'Sep', historical: 1400, forecast: null, confidence: null },
          { month: 'Oct', historical: 1700, forecast: null, confidence: null },
          { month: 'Nov', historical: 1550, forecast: null, confidence: null },
          { month: 'Dec', historical: 1800, forecast: null, confidence: null },
          {
            month: 'Jan',
            historical: null,
            forecast: 1650,
            confidence: { lower: 1500, upper: 1800 },
          },
          {
            month: 'Feb',
            historical: null,
            forecast: 1750,
            confidence: { lower: 1600, upper: 1900 },
          },
          {
            month: 'Mar',
            historical: null,
            forecast: 1600,
            confidence: { lower: 1450, upper: 1750 },
          },
          {
            month: 'Apr',
            historical: null,
            forecast: 1850,
            confidence: { lower: 1700, upper: 2000 },
          },
          {
            month: 'May',
            historical: null,
            forecast: 1900,
            confidence: { lower: 1750, upper: 2050 },
          },
          {
            month: 'Jun',
            historical: null,
            forecast: 1800,
            confidence: { lower: 1650, upper: 1950 },
          },
        ];
        break;
      case 'financial':
        forecastData = [
          {
            month: 'Jul',
            historical: 2400000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Aug',
            historical: 2600000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Sep',
            historical: 2200000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Oct',
            historical: 2700000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Nov',
            historical: 2500000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Dec',
            historical: 2800000,
            forecast: null,
            confidence: null,
          },
          {
            month: 'Jan',
            historical: null,
            forecast: 2650000,
            confidence: { lower: 2400000, upper: 2900000 },
          },
          {
            month: 'Feb',
            historical: null,
            forecast: 2750000,
            confidence: { lower: 2500000, upper: 3000000 },
          },
          {
            month: 'Mar',
            historical: null,
            forecast: 2600000,
            confidence: { lower: 2350000, upper: 2850000 },
          },
          {
            month: 'Apr',
            historical: null,
            forecast: 2850000,
            confidence: { lower: 2600000, upper: 3100000 },
          },
          {
            month: 'May',
            historical: null,
            forecast: 2900000,
            confidence: { lower: 2650000, upper: 3150000 },
          },
          {
            month: 'Jun',
            historical: null,
            forecast: 2800000,
            confidence: { lower: 2550000, upper: 3050000 },
          },
        ];
        break;
      case 'bed-occupancy':
        forecastData = [
          { month: 'Jul', historical: 85, forecast: null, confidence: null },
          { month: 'Aug', historical: 88, forecast: null, confidence: null },
          { month: 'Sep', historical: 82, forecast: null, confidence: null },
          { month: 'Oct', historical: 90, forecast: null, confidence: null },
          { month: 'Nov', historical: 87, forecast: null, confidence: null },
          { month: 'Dec', historical: 92, forecast: null, confidence: null },
          {
            month: 'Jan',
            historical: null,
            forecast: 89,
            confidence: { lower: 85, upper: 93 },
          },
          {
            month: 'Feb',
            historical: null,
            forecast: 91,
            confidence: { lower: 87, upper: 95 },
          },
          {
            month: 'Mar',
            historical: null,
            forecast: 88,
            confidence: { lower: 84, upper: 92 },
          },
          {
            month: 'Apr',
            historical: null,
            forecast: 94,
            confidence: { lower: 90, upper: 98 },
          },
          {
            month: 'May',
            historical: null,
            forecast: 96,
            confidence: { lower: 92, upper: 100 },
          },
          {
            month: 'Jun',
            historical: null,
            forecast: 93,
            confidence: { lower: 89, upper: 97 },
          },
        ];
        break;
      default:
        return res.status(400).json({ error: 'Invalid forecast type' });
    }

    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET AI insights */
router.get('/insights/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    console.log(`Fetching insights for hospital ${hospitalId}, type: ${type}`);

    // First, try to get fresh insights from the database
    const dbInsights = await prisma.aiInsight.findMany({
      where: {
        hospitalId,
        isActive: true,
      },
      orderBy: {
        generatedDate: 'desc',
      },
      take: 10,
    });

    // Check if we have recent insights (less than 24 hours old)
    const twentyFourHoursAgo = new Date(
      Date.now() - INSIGHT_FRESHNESS_HOURS * 60 * 60 * 1000
    );
    const hasRecentInsights = dbInsights.some(
      (insight) => insight.generatedDate > twentyFourHoursAgo
    );

    // Find old active insights that need to be deactivated
    const oldActiveInsights = dbInsights.filter(
      (insight) => insight.generatedDate <= twentyFourHoursAgo
    );

    // Background deactivation of old insights (non-blocking) - only if needed
    if (oldActiveInsights.length > 0) {
      const deactivateOldInsights = async (insightIds) => {
        try {
          const result = await prisma.aiInsight.updateMany({
            where: {
              id: { in: insightIds },
              isActive: true,
            },
            data: {
              isActive: false,
            },
          });
          if (result.count > 0) {
            console.log(
              `Deactivated ${result.count} old insights for hospital ${hospitalId}`
            );
          }
        } catch (error) {
          console.error('Error deactivating old insights:', error);
        }
      };

      // Run deactivation in background (non-blocking)
      const oldInsightIds = oldActiveInsights.map((insight) => insight.id);
      setImmediate(() => deactivateOldInsights(oldInsightIds));
    }

    // If no recent insights, try to generate new ones
    if (!hasRecentInsights) {
      console.log('No recent insights found, generating new ones...');
      try {
        const result = await generateAndSaveInsights(hospitalId, type);

        if (result.success) {
          // Fetch the newly generated insights
          const newInsights = await prisma.aiInsight.findMany({
            where: {
              hospitalId,
              isActive: true,
            },
            orderBy: {
              generatedDate: 'desc',
            },
            take: 10,
          });

          const formattedInsights = newInsights.map((insight, index) => ({
            id: index + 1,
            title: insight.title,
            description: insight.insightText,
            impact: insight.impact || 'Medium',
            category: insight.category || 'General',
            generatedDate: insight.generatedDate,
            isAIGenerated: true,
          }));

          return res.json(formattedInsights);
        }
      } catch (error) {
        console.error('Error generating new insights:', error);
        // Continue to fallback options
      }
    }

    // If we have database insights, format and return them
    if (dbInsights.length > 0) {
      const formattedInsights = dbInsights.map((insight, index) => ({
        id: index + 1,
        title: insight.title,
        description: insight.insightText,
        impact: insight.impact || 'Medium',
        category: insight.category || 'General',
        generatedDate: insight.generatedDate,
        isAIGenerated: true,
      }));

      return res.json(formattedInsights);
    }

    // No insights available - return error
    console.log('No AI insights available in database');
    return res.status(404).json({
      error: 'No insights available',
      message:
        'No AI insights found for this hospital. Please try generating new insights.',
    });
  } catch (error) {
    console.error('Analytics insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* POST trigger manual insight generation */
router.post('/insights/generate', async (req, res) => {
  try {
    const { hospitalId, insightType = 'general' } = req.body;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    console.log(
      `Manually triggering insight generation for hospital ${hospitalId}, type: ${insightType}`
    );

    const result = await insightScheduler.triggerInsightGeneration(
      hospitalId,
      insightType
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Insights generated successfully',
        insightCount: result.savedCount,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: 'Failed to generate insights',
      });
    }
  } catch (error) {
    console.error('Error in manual insight generation:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal server error',
    });
  }
});

/* GET scheduler status */
router.get('/scheduler/status', async (req, res) => {
  try {
    const status = insightScheduler.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({ error: error.message });
  }
});

/* POST start scheduler */
router.post('/scheduler/start', async (req, res) => {
  try {
    insightScheduler.start();
    res.json({
      success: true,
      message: 'Insight scheduler started successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    res.status(500).json({ error: error.message });
  }
});

/* POST stop scheduler */
router.post('/scheduler/stop', async (req, res) => {
  try {
    insightScheduler.stop();
    res.json({
      success: true,
      message: 'Insight scheduler stopped successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error stopping scheduler:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
