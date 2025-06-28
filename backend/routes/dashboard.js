var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');

/* GET dashboard KPIs */
router.get('/kpis', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    // Total patients (simulated for now)
    const totalPatients = 1847;
    
    // Revenue from current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const financialSummary = await prisma.monthlyFinancialSummary.findFirst({
      where: { 
        hospitalId,
        monthYear: {
          gte: currentMonth
        }
      },
      orderBy: { monthYear: 'desc' }
    });

    const kpis = {
      totalPatients: {
        value: totalPatients,
        trend: '12'
      },
      revenue: {
        value: financialSummary?.totalRevenue || 2400000,
        trend: '8'
      },
      avgSessionTime: {
        value: '45 min',
        trend: '-3'
      },
      readmissionRate: {
        value: '12.3%',
        trend: '-2'
      }
    };

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET patient inflow data */
router.get('/patient-inflow', async (req, res) => {
  try {
    // Simulated patient inflow data
    const patientInflowData = [
      { month: "Jan", patients: 1200, admissions: 800 },
      { month: "Feb", patients: 1400, admissions: 950 },
      { month: "Mar", patients: 1100, admissions: 750 },
      { month: "Apr", patients: 1600, admissions: 1100 },
      { month: "May", patients: 1800, admissions: 1250 },
      { month: "Jun", patients: 1500, admissions: 1000 },
    ];

    res.json(patientInflowData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET budget data */
router.get('/budget', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const summary = await prisma.monthlyFinancialSummary.findFirst({
      where: { 
        hospitalId,
        monthYear: {
          gte: currentMonth
        }
      },
      orderBy: { monthYear: 'desc' }
    });

    if (summary) {
      const allocated = parseFloat(summary.budgetAllocated || 0);
      const used = parseFloat(summary.budgetUsed || 0);
      const usedPercentage = allocated > 0 ? Math.round((used / allocated) * 100) : 0;
      
      const budgetData = [
        { name: "Used", value: usedPercentage, color: "#3A86FF" },
        { name: "Remaining", value: 100 - usedPercentage, color: "#E5E7EB" },
      ];
      
      res.json(budgetData);
    } else {
      // Default data
      const budgetData = [
        { name: "Used", value: 68, color: "#3A86FF" },
        { name: "Remaining", value: 32, color: "#E5E7EB" },
      ];
      res.json(budgetData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET AI insights */
router.get('/ai-insights', async (req, res) => {
  try {
    // Simulated AI insights
    const aiInsights = [
      "Patient inflow is 15% higher than last quarter, consider staffing adjustments",
      "Budget utilization is on track, with 32% remaining for Q1",
      "3 compliance tasks require immediate attention",
      "Readmission rates have decreased by 8% this month",
    ];

    res.json(aiInsights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
