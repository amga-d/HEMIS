const prisma = require('../services/prismaClient');

// Helper function to calculate percentage trend
function calculateTrend(current, previous) {
  if (!previous || previous === 0) return '0.0';
  return (((current - previous) / previous) * 100).toFixed(1);
}

// Helper function to format trend with + sign
function formatTrend(trend) {
  const trendValue = parseFloat(trend);
  return trendValue > 0 ? `+${trend}` : trend;
}

// Helper function to get current month boundaries
function getCurrentMonthBoundaries() {
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const previousMonth = new Date(currentMonth);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  return { currentMonth, nextMonth, previousMonth };
}

// Helper function to calculate total patients from visits
async function calculateTotalPatients(hospitalId) {
  const { currentMonth, nextMonth, previousMonth } =
    getCurrentMonthBoundaries();

  const [currentPatients, previousPatients] = await Promise.all([
    prisma.patientVisit.count({
      where: {
        hospitalId,
        admissionDate: { gte: currentMonth, lt: nextMonth },
      },
    }),
    prisma.patientVisit.count({
      where: {
        hospitalId,
        admissionDate: { gte: previousMonth, lt: currentMonth },
      },
    }),
  ]);

  const trend = calculateTrend(currentPatients, previousPatients);
  return {
    value: currentPatients,
    trend: formatTrend(trend),
  };
}

// Helper function to calculate revenue from financial summaries
async function calculateRevenue(hospitalId) {
  const { currentMonth, previousMonth } = getCurrentMonthBoundaries();

  const [currentSummary, previousSummary] = await Promise.all([
    prisma.monthlyFinancialSummary.findFirst({
      where: { hospitalId, monthYear: { gte: currentMonth } },
      orderBy: { monthYear: 'desc' },
    }),
    prisma.monthlyFinancialSummary.findFirst({
      where: {
        hospitalId,
        monthYear: { gte: previousMonth, lt: currentMonth },
      },
    }),
  ]);

  const currentRevenue = parseFloat(currentSummary?.totalRevenue || 0);
  const previousRevenue = parseFloat(previousSummary?.totalRevenue || 0);

  const trend = calculateTrend(currentRevenue, previousRevenue);
  return {
    value: currentRevenue,
    trend: formatTrend(trend),
  };
}

// Helper function to calculate average session time from patient visits
async function calculateAvgSessionTime(hospitalId) {
  const { currentMonth, nextMonth, previousMonth } =
    getCurrentMonthBoundaries();

  const [currentVisits, previousVisits] = await Promise.all([
    prisma.patientVisit.findMany({
      where: {
        hospitalId,
        admissionDate: { gte: currentMonth, lt: nextMonth },
        sessionDuration: { not: null },
      },
      select: { sessionDuration: true },
    }),
    prisma.patientVisit.findMany({
      where: {
        hospitalId,
        admissionDate: { gte: previousMonth, lt: currentMonth },
        sessionDuration: { not: null },
      },
      select: { sessionDuration: true },
    }),
  ]);

  const currentAvg =
    currentVisits.length > 0
      ? currentVisits.reduce((sum, visit) => sum + visit.sessionDuration, 0) /
        currentVisits.length
      : 0;

  const previousAvg =
    previousVisits.length > 0
      ? previousVisits.reduce((sum, visit) => sum + visit.sessionDuration, 0) /
        previousVisits.length
      : 0;

  const trend = calculateTrend(currentAvg, previousAvg);
  return {
    value: `${Math.round(currentAvg)} min`,
    trend: formatTrend(trend),
  };
}

// Helper function to calculate readmission rate from patient visits
async function calculateReadmissionRate(hospitalId) {
  const { currentMonth, nextMonth, previousMonth } =
    getCurrentMonthBoundaries();

  const [currentStats, previousStats] = await Promise.all([
    Promise.all([
      prisma.patientVisit.count({
        where: {
          hospitalId,
          admissionDate: { gte: currentMonth, lt: nextMonth },
        },
      }),
      prisma.patientVisit.count({
        where: {
          hospitalId,
          admissionDate: { gte: currentMonth, lt: nextMonth },
          isReadmission: true,
        },
      }),
    ]),
    Promise.all([
      prisma.patientVisit.count({
        where: {
          hospitalId,
          admissionDate: { gte: previousMonth, lt: currentMonth },
        },
      }),
      prisma.patientVisit.count({
        where: {
          hospitalId,
          admissionDate: { gte: previousMonth, lt: currentMonth },
          isReadmission: true,
        },
      }),
    ]),
  ]);

  const [currentTotal, currentReadmissions] = currentStats;
  const [previousTotal, previousReadmissions] = previousStats;

  const currentRate =
    currentTotal > 0 ? (currentReadmissions / currentTotal) * 100 : 0;
  const previousRate =
    previousTotal > 0 ? (previousReadmissions / previousTotal) * 100 : 0;

  const trend = calculateTrend(currentRate, previousRate);
  return {
    value: `${currentRate.toFixed(1)}%`,
    trend: formatTrend(trend),
  };
}

module.exports = {
  calculateTrend,
  formatTrend,
  getCurrentMonthBoundaries,
  calculateTotalPatients,
  calculateRevenue,
  calculateAvgSessionTime,
  calculateReadmissionRate,
};
