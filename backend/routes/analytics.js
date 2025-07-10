var express = require("express");
var router = express.Router();
const prisma = require("../services/prismaClient");

/* GET forecast data */
router.get("/forecast/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { hospitalId } = req.query;

    // Try to get real forecast data from database first
    const dbForecastData = await prisma.forecastData.findMany({
      where: {
        hospitalId,
        forecastType: type.toUpperCase().replace('-', '_')
      },
      orderBy: {
        periodDate: 'asc'
      },
      take: 12
    });

    if (dbForecastData.length > 0) {
      const formattedData = dbForecastData.map(item => ({
        month: item.periodDate.toLocaleDateString('en-US', { month: 'short' }),
        historical: item.historicalValue ? parseFloat(item.historicalValue) : null,
        forecast: item.forecastValue ? parseFloat(item.forecastValue) : null,
        confidence: item.confidenceLower && item.confidenceUpper ? {
          lower: parseFloat(item.confidenceLower),
          upper: parseFloat(item.confidenceUpper)
        } : null
      }));
      return res.json(formattedData);
    }

    // Fallback to simulated data if no database data
    let forecastData = [];

    switch (type) {
      case "patient-inflow":
        forecastData = [
          { month: "Jul", historical: 1500, forecast: null, confidence: null },
          { month: "Aug", historical: 1600, forecast: null, confidence: null },
          { month: "Sep", historical: 1400, forecast: null, confidence: null },
          { month: "Oct", historical: 1700, forecast: null, confidence: null },
          { month: "Nov", historical: 1550, forecast: null, confidence: null },
          { month: "Dec", historical: 1800, forecast: null, confidence: null },
          { month: "Jan", historical: null, forecast: 1650, confidence: { lower: 1500, upper: 1800 } },
          { month: "Feb", historical: null, forecast: 1750, confidence: { lower: 1600, upper: 1900 } },
          { month: "Mar", historical: null, forecast: 1600, confidence: { lower: 1450, upper: 1750 } },
          { month: "Apr", historical: null, forecast: 1850, confidence: { lower: 1700, upper: 2000 } },
          { month: "May", historical: null, forecast: 1900, confidence: { lower: 1750, upper: 2050 } },
          { month: "Jun", historical: null, forecast: 1800, confidence: { lower: 1650, upper: 1950 } },
        ];
        break;
      case "financial":
        forecastData = [
          { month: "Jul", historical: 2400000, forecast: null, confidence: null },
          { month: "Aug", historical: 2600000, forecast: null, confidence: null },
          { month: "Sep", historical: 2200000, forecast: null, confidence: null },
          { month: "Oct", historical: 2700000, forecast: null, confidence: null },
          { month: "Nov", historical: 2500000, forecast: null, confidence: null },
          { month: "Dec", historical: 2800000, forecast: null, confidence: null },
          { month: "Jan", historical: null, forecast: 2650000, confidence: { lower: 2400000, upper: 2900000 } },
          { month: "Feb", historical: null, forecast: 2750000, confidence: { lower: 2500000, upper: 3000000 } },
          { month: "Mar", historical: null, forecast: 2600000, confidence: { lower: 2350000, upper: 2850000 } },
          { month: "Apr", historical: null, forecast: 2850000, confidence: { lower: 2600000, upper: 3100000 } },
          { month: "May", historical: null, forecast: 2900000, confidence: { lower: 2650000, upper: 3150000 } },
          { month: "Jun", historical: null, forecast: 2800000, confidence: { lower: 2550000, upper: 3050000 } },
        ];
        break;
      case "bed-occupancy":
        forecastData = [
          { month: "Jul", historical: 85, forecast: null, confidence: null },
          { month: "Aug", historical: 88, forecast: null, confidence: null },
          { month: "Sep", historical: 82, forecast: null, confidence: null },
          { month: "Oct", historical: 90, forecast: null, confidence: null },
          { month: "Nov", historical: 87, forecast: null, confidence: null },
          { month: "Dec", historical: 92, forecast: null, confidence: null },
          { month: "Jan", historical: null, forecast: 89, confidence: { lower: 85, upper: 93 } },
          { month: "Feb", historical: null, forecast: 91, confidence: { lower: 87, upper: 95 } },
          { month: "Mar", historical: null, forecast: 88, confidence: { lower: 84, upper: 92 } },
          { month: "Apr", historical: null, forecast: 94, confidence: { lower: 90, upper: 98 } },
          { month: "May", historical: null, forecast: 96, confidence: { lower: 92, upper: 100 } },
          { month: "Jun", historical: null, forecast: 93, confidence: { lower: 89, upper: 97 } },
        ];
        break;
      default:
        return res.status(400).json({ error: "Invalid forecast type" });
    }

    res.json(forecastData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET AI insights */
router.get("/insights/:type", async (req, res) => {
  try {
    const { type } = req.params;

    let insights = [];

    switch (type) {
      case "optimization":
        insights = [
          {
            id: 1,
            title: "Staffing Optimization",
            description: "Consider redistributing nursing staff to handle expected 15% increase in patient volume",
            impact: "High",
            category: "Operations",
          },
          {
            id: 2,
            title: "Cost Reduction",
            description: "Pharmaceutical procurement can be optimized to save approximately $50K annually",
            impact: "Medium",
            category: "Finance",
          },
        ];
        break;
      case "prediction":
        insights = [
          {
            id: 1,
            title: "Revenue Forecast",
            description: "Expected 12% revenue growth in Q2 based on historical trends and market analysis",
            impact: "High",
            category: "Finance",
          },
          {
            id: 2,
            title: "Capacity Planning",
            description: "ICU capacity may reach 95% utilization in peak season, consider expansion",
            impact: "High",
            category: "Operations",
          },
        ];
        break;
      default:
        insights = [
          {
            id: 1,
            title: "General Insight",
            description: "System performance is within expected parameters",
            impact: "Low",
            category: "General",
          },
        ];
    }

    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
