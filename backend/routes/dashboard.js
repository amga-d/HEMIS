var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');
const {
  calculateTotalPatients,
  calculateRevenue,
  calculateAvgSessionTime,
  calculateReadmissionRate,
} = require('../helpers/dashboardHelpers');

/* GET dashboard KPIs */
router.get('/kpis', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Get the most recent KPI data from the database (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get latest KPI values for each type
    const kpiTypes = [
      'total_patients',
      'revenue',
      'avg_session_time',
      'readmission_rate',
    ];

    const kpiResults = {};

    // Try to get from DashboardKPI table first
    for (const kpiType of kpiTypes) {
      const kpiData = await prisma.dashboardKPI.findFirst({
        where: {
          hospitalId,
          kpiType: kpiType,
          date: {
            gte: thirtyDaysAgo,
            lte: today,
          },
        },
        orderBy: { date: 'desc' },
      });

      if (kpiData) {
        const trend = kpiData.trend || 0;
        kpiResults[kpiType] = {
          value: parseFloat(kpiData.value),
          trend: trend > 0 ? `+${trend.toFixed(1)}` : trend.toFixed(1),
        };
      }
    }

    // Build response with database data or calculated fallbacks
    const kpis = {
      totalPatients:
        kpiResults['total_patients'] ||
        (await calculateTotalPatients(hospitalId)),
      revenue: kpiResults['revenue'] || (await calculateRevenue(hospitalId)),
      avgSessionTime:
        kpiResults['avg_session_time'] ||
        (await calculateAvgSessionTime(hospitalId)),
      readmissionRate:
        kpiResults['readmission_rate'] ||
        (await calculateReadmissionRate(hospitalId)),
    };

    res.json(kpis);
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ error: error.message });
  }
});

/* GET patient inflow data */
router.get('/patient-inflow', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Get last 6 months of patient visit data
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      months.push(date);
    }

    const patientInflowData = await Promise.all(
      months.map(async (month) => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Count total patient visits in the month
        const patients = await prisma.patientVisit.count({
          where: {
            hospitalId,
            admissionDate: {
              gte: month,
              lt: nextMonth,
            },
          },
        });

        // Count admissions (inpatient visits)
        const admissions = await prisma.patientVisit.count({
          where: {
            hospitalId,
            visitType: 'INPATIENT',
            admissionDate: {
              gte: month,
              lt: nextMonth,
            },
          },
        });

        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          patients,
          admissions,
        };
      })
    );

    res.json(patientInflowData);
  } catch (error) {
    console.error('Error fetching patient inflow data:', error);
    res.status(500).json({ error: error.message });
  }
});

/* GET budget data */
router.get('/budget', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    // Use July 2025 to match our seeded data
    const currentMonth = new Date('2025-07-01');

    const summary = await prisma.monthlyFinancialSummary.findFirst({
      where: {
        hospitalId,
        monthYear: {
          gte: currentMonth,
        },
      },
      orderBy: { monthYear: 'desc' },
    });

    if (summary) {
      const allocated = parseFloat(summary.budgetAllocated || 0);
      const used = parseFloat(summary.budgetUsed || 0);
      const usedPercentage =
        allocated > 0 ? Math.round((used / allocated) * 100) : 0;

      const budgetData = [
        { name: 'Used', value: usedPercentage, color: '#3A86FF' },
        { name: 'Remaining', value: 100 - usedPercentage, color: '#E5E7EB' },
      ];

      const budgetDetails = {
        data: budgetData,
        allocated: allocated,
        used: used,
        usedPercentage: usedPercentage,
        remaining: allocated - used,
      };

      res.json(budgetDetails);
    } else {
      // Try to get any financial summary if current month not found
      const anySummary = await prisma.monthlyFinancialSummary.findFirst({
        where: { hospitalId },
        orderBy: { monthYear: 'desc' },
      });

      if (anySummary) {
        const allocated = parseFloat(anySummary.budgetAllocated || 0);
        const used = parseFloat(anySummary.budgetUsed || 0);
        const usedPercentage =
          allocated > 0 ? Math.round((used / allocated) * 100) : 0;

        const budgetData = [
          { name: 'Used', value: usedPercentage, color: '#3A86FF' },
          { name: 'Remaining', value: 100 - usedPercentage, color: '#E5E7EB' },
        ];

        const budgetDetails = {
          data: budgetData,
          allocated: allocated,
          used: used,
          usedPercentage: usedPercentage,
          remaining: allocated - used,
        };

        res.json(budgetDetails);
      } else {
        // No financial data available
        const budgetData = [
          { name: 'Used', value: 0, color: '#3A86FF' },
          { name: 'Remaining', value: 100, color: '#E5E7EB' },
        ];

        const budgetDetails = {
          data: budgetData,
          allocated: 0,
          used: 0,
          usedPercentage: 0,
          remaining: 0,
        };

        res.json(budgetDetails);
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET AI insights */
router.get('/ai-insights', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Get AI insights from database
    const dbInsights = await prisma.aiInsight.findMany({
      where: {
        hospitalId,
        isActive: true,
      },
      orderBy: {
        generatedDate: 'desc',
      },
      take: 5,
    });

    const insights = dbInsights.map((insight) => insight.insightText);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
