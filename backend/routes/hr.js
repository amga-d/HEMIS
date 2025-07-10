var express = require('express');
var router = express.Router();
const prisma = require('../services/prismaClient');

/* GET employees list */
router.get('/employees', async (req, res) => {
  try {
    const { hospitalId } = req.query;
    
    const employees = await prisma.employee.findMany({
      where: hospitalId ? { hospitalId } : {},
      include: {
        department: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        firstName: 'asc'
      }
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
    
    // Get staffing by department
    const staffingData = await prisma.employee.groupBy({
      by: ['departmentId'],
      where: { 
        hospitalId,
        status: 'ACTIVE'
      },
      _count: {
        id: true
      },
      _avg: {
        performanceScore: true
      }
    });

    // Get department details
    const departments = await prisma.department.findMany({
      where: { hospitalId }
    });

    // Combine data
    const staffingLevels = departments.map(dept => {
      const staffData = staffingData.find(s => s.departmentId === dept.id);
      const current = staffData?._count.id || 0;
      // Simulate required staffing levels
      const required = Math.ceil(current * (1 + Math.random() * 0.2));
      
      return {
        department: dept.name,
        current,
        required,
        avgPerformance: staffData?._avg.performanceScore || 0
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

    const trends = await Promise.all(months.map(async (month) => {
      const nextMonth = new Date(month);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const hires = await prisma.employee.count({
        where: {
          hospitalId,
          hireDate: {
            gte: month,
            lt: nextMonth
          }
        }
      });

      const departures = await prisma.employee.count({
        where: {
          hospitalId,
          departureDate: {
            gte: month,
            lt: nextMonth
          }
        }
      });

      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        hires,
        departures
      };
    }));

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET top performers */
router.get('/top-performers', async (req, res) => {
  try {
    const { hospitalId, limit = 5 } = req.query;
    const topPerformers = await prisma.employee.findMany({
      where: { 
        hospitalId,
        performanceScore: { not: null },
        status: 'ACTIVE'
      },
      orderBy: { performanceScore: 'desc' },
      take: parseInt(limit),
      include: { 
        department: true
      }
    });

    const formattedPerformers = topPerformers.map(emp => ({
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department?.name || 'N/A',
      score: parseFloat(emp.performanceScore || 0),
      position: emp.position,
      achievement: 'Excellence Award' // Static for now
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
    
    // Total active staff
    const totalStaff = await prisma.employee.count({
      where: { 
        hospitalId,
        status: 'ACTIVE'
      }
    });

    // Turnover rate (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const departures = await prisma.employee.count({
      where: {
        hospitalId,
        departureDate: {
          gte: oneYearAgo
        }
      }
    });

    const turnoverRate = totalStaff > 0 ? ((departures / totalStaff) * 100).toFixed(1) : 0;

    // Average performance score
    const avgPerformance = await prisma.employee.aggregate({
      where: {
        hospitalId,
        status: 'ACTIVE',
        performanceScore: { not: null }
      },
      _avg: {
        performanceScore: true
      }
    });

    // Calculate average training hours from employee training records
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    
    const trainingStats = await prisma.employeeTraining.aggregate({
      where: {
        employee: {
          hospitalId,
          status: 'ACTIVE'
        },
        trainingDate: {
          gte: yearStart
        }
      },
      _avg: {
        hoursCompleted: true
      }
    });

    const kpis = {
      totalStaff: {
        value: totalStaff,
        trend: '4.0' // Static for now
      },
      turnoverRate: {
        value: turnoverRate,
        trend: '-1.5'
      },
      satisfactionScore: {
        value: (parseFloat(avgPerformance._avg.performanceScore || 0) / 2).toFixed(1), // Convert to 5-point scale
        trend: '0.3'
      },
      avgTrainingHours: {
        value: trainingStats._avg.hoursCompleted ? Math.round(trainingStats._avg.hoursCompleted).toString() : '42',
        trend: '8'
      }
    };

    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;