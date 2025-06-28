var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');

/* GET monthly financial summary */
router.get('/summary', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    const summaries = await prisma.monthlyFinancialSummary.findMany({
      where: { hospitalId },
      orderBy: { monthYear: 'asc' }
    });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET recent transactions */
router.get('/transactions', async (req, res) => {
  try {
    const { hospitalId, limit = 10 } = req.query;
    const transactions = await prisma.financialTransaction.findMany({
      where: { hospitalId },
      orderBy: { transactionDate: 'desc' },
      take: parseInt(limit),
      include: { 
        department: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            position: true
          }
        }
      }
    });
    
    // Format transactions for frontend
    const formattedTransactions = transactions.map(t => ({
      id: t.id,
      date: t.transactionDate.toISOString().split('T')[0],
      description: t.description,
      category: t.category,
      amount: parseFloat(t.amount),
      department: t.department?.name || 'N/A',
      createdBy: t.creator ? `${t.creator.firstName} ${t.creator.lastName}` : 'System'
    }));
    
    res.json(formattedTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET financial KPIs */
router.get('/kpis', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    // Get current month summary
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const currentSummary = await prisma.monthlyFinancialSummary.findFirst({
      where: { 
        hospitalId,
        monthYear: {
          gte: currentMonth
        }
      },
      orderBy: { monthYear: 'desc' }
    });

    // Get previous month for comparison
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    
    const previousSummary = await prisma.monthlyFinancialSummary.findFirst({
      where: { 
        hospitalId,
        monthYear: {
          gte: previousMonth,
          lt: currentMonth
        }
      }
    });

    // Calculate trends
    const calculateTrend = (current, previous) => {
      if (!previous || previous === 0) return 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    const kpis = {
      totalRevenue: {
        value: currentSummary?.totalRevenue || 0,
        trend: calculateTrend(
          parseFloat(currentSummary?.totalRevenue || 0),
          parseFloat(previousSummary?.totalRevenue || 0)
        )
      },
      totalCosts: {
        value: currentSummary?.totalCosts || 0,
        trend: calculateTrend(
          parseFloat(currentSummary?.totalCosts || 0),
          parseFloat(previousSummary?.totalCosts || 0)
        )
      },
      netProfit: {
        value: currentSummary?.netProfit || 0,
        trend: calculateTrend(
          parseFloat(currentSummary?.netProfit || 0),
          parseFloat(previousSummary?.netProfit || 0)
        )
      },
      budgetVariance: {
        value: currentSummary ? 
          parseFloat(currentSummary.budgetAllocated || 0) - parseFloat(currentSummary.budgetUsed || 0) : 0,
        trend: '5.0' // Static for now
      }
    };

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;