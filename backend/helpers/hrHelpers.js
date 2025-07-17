const prisma = require('../services/prismaClient');

// Helper function to calculate percentage trend
function calculateTrend(current, previous) {
  if (!previous || previous === 0) return '0.0';
  return (((current - previous) / previous) * 100).toFixed(1);
}

// Helper function to get current HR metrics from raw data
async function getCurrentHRMetrics(hospitalId) {
  const [totalStaff, departures, avgPerformanceResult, trainingStats] =
    await Promise.all([
      // Total active staff
      prisma.employee.count({
        where: { hospitalId, status: 'ACTIVE' },
      }),
      // Departures in last 12 months
      prisma.employee.count({
        where: {
          hospitalId,
          departureDate: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          },
        },
      }),
      // Average performance score
      prisma.employee.aggregate({
        where: {
          hospitalId,
          status: 'ACTIVE',
          performanceScore: { not: null },
        },
        _avg: { performanceScore: true },
      }),
      // Average training hours this year
      prisma.employeeTraining.aggregate({
        where: {
          employee: { hospitalId, status: 'ACTIVE' },
          trainingDate: { gte: new Date(new Date().getFullYear(), 0, 1) },
        },
        _avg: { hoursCompleted: true },
      }),
    ]);

  const turnoverRate = totalStaff > 0 ? (departures / totalStaff) * 100 : 0;
  const avgPerformance = parseFloat(
    avgPerformanceResult._avg.performanceScore || 0
  );
  const avgTrainingHours = parseFloat(trainingStats._avg.hoursCompleted || 0);

  return { totalStaff, turnoverRate, avgPerformance, avgTrainingHours };
}

module.exports = {
  calculateTrend,
  getCurrentHRMetrics,
};
