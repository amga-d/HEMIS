var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');
const { calculateTrend } = require('../helpers/hrHelpers');

/* GET employees list */
router.get('/employees', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    const employees = await prisma.employee.findMany({
      where: hospitalId ? { hospitalId } : {},
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

/* GET staffing levels */
router.get('/staffing', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    // Get department staffing data from database
    const departmentStaffing = await prisma.departmentStaffing.findMany({
      where: { hospitalId },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get average performance scores by department
    const departmentPerformances = await prisma.employee.groupBy({
      by: ['departmentId'],
      where: {
        hospitalId,
        status: 'ACTIVE',
        performanceScore: { not: null },
      },
      _avg: {
        performanceScore: true,
      },
    });

    // Combine data
    const staffingLevels = departmentStaffing.map((staffing) => {
      const performanceData = departmentPerformances.find(
        (p) => p.departmentId === staffing.departmentId
      );

      return {
        department: staffing.department.name,
        current: staffing.currentStaff,
        required: staffing.requiredStaff,
        avgPerformance: performanceData?._avg.performanceScore || 0,
      };
    });

    res.json(staffingLevels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET hiring trends */
router.get('/hiring-trends', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    // Get last 6 months of hiring data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      months.push(date);
    }

    const trends = await Promise.all(
      months.map(async (month) => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const hires = await prisma.employee.count({
          where: {
            hospitalId,
            hireDate: {
              gte: month,
              lt: nextMonth,
            },
          },
        });

        const departures = await prisma.employee.count({
          where: {
            hospitalId,
            departureDate: {
              gte: month,
              lt: nextMonth,
            },
          },
        });

        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          hires,
          departures,
        };
      })
    );

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET top performers */
router.get('/top-performers', async (req, res) => {
  try {
    const { hospitalId, limit = 5 } = req.query;

    // Get top performers with their latest performance evaluation
    const topPerformers = await prisma.employee.findMany({
      where: {
        hospitalId,
        performanceScore: { not: null },
        status: 'ACTIVE',
      },
      orderBy: { performanceScore: 'desc' },
      take: parseInt(limit),
      include: {
        department: true,
        performanceEvaluations: {
          orderBy: { evaluationPeriod: 'desc' },
          take: 1,
          select: {
            achievementDescription: true,
          },
        },
      },
    });

    const formattedPerformers = topPerformers.map((emp) => ({
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department?.name || 'N/A',
      score: parseFloat(emp.performanceScore || 0),
      position: emp.position,
      achievement:
        emp.performanceEvaluations[0]?.achievementDescription ||
        'Outstanding Performance',
    }));

    res.json(formattedPerformers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET HR KPIs */
router.get('/kpis', async (req, res) => {
  try {
    const { hospitalId } = req.query;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Get the two most recent HR monthly stats
    const recentStats = await prisma.hrMonthlyStats.findMany({
      where: { hospitalId },
      orderBy: { monthYear: 'desc' },
      take: 2,
    });

    if (recentStats.length === 0) {
      return res.status(404).json({ error: 'No HR monthly stats found' });
    }

    // Use the most recent stats for current values
    const current = recentStats[0];
    const currentMetrics = {
      totalStaff: current.totalStaff,
      turnoverRate: parseFloat(current.turnoverRate || 0),
      avgPerformance: parseFloat(current.avgPerformanceScore || 0),
      avgTrainingHours: parseFloat(current.avgTrainingHours || 0),
    };

    // Calculate trends if we have previous month data
    let staffTrend = '0.0';
    let turnoverTrend = '0.0';
    let satisfactionTrend = '0.0';
    let trainingTrend = '0.0';

    if (recentStats.length >= 2) {
      const previous = recentStats[1];

      staffTrend = calculateTrend(current.totalStaff, previous.totalStaff);
      turnoverTrend = calculateTrend(
        parseFloat(current.turnoverRate || 0),
        parseFloat(previous.turnoverRate || 0)
      );
      satisfactionTrend = calculateTrend(
        parseFloat(current.avgPerformanceScore || 0),
        parseFloat(previous.avgPerformanceScore || 0)
      );
      trainingTrend = calculateTrend(
        parseFloat(current.avgTrainingHours || 0),
        parseFloat(previous.avgTrainingHours || 0)
      );
    }

    const kpis = {
      totalStaff: {
        value: currentMetrics.totalStaff,
        trend: staffTrend,
      },
      turnoverRate: {
        value: currentMetrics.turnoverRate.toFixed(1),
        trend: turnoverTrend,
      },
      satisfactionScore: {
        value: currentMetrics.avgPerformance.toFixed(1),
        trend: satisfactionTrend,
      },
      avgTrainingHours: {
        value: Math.round(currentMetrics.avgTrainingHours).toString(),
        trend: trainingTrend,
      },
    };

    res.json(kpis);
  } catch (error) {
    console.error('Error fetching HR KPIs:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
