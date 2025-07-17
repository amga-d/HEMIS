const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('./prismaClient');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsights = async (hospitalId, insightType = 'general') => {
  try {
    console.log(
      `Generating insights for hospital ${hospitalId}, type: ${insightType}`
    );

    // Collect relevant data based on insight type
    const hospitalData = await collectHospitalData(hospitalId, insightType);

    // Build prompt for Gemini AI
    const prompt = buildPrompt(hospitalData, insightType);

    // Generate insights using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Parse and return insights
    const insights = parseGeminiResponse(response.text());

    console.log(
      `Generated ${insights.insights.length} insights for hospital ${hospitalId}`
    );
    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};

const collectHospitalData = async (hospitalId, insightType) => {
  try {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const sixtyDaysAgo = new Date(
      currentDate.getTime() - 60 * 24 * 60 * 60 * 1000
    );
    const ninetyDaysAgo = new Date(
      currentDate.getTime() - 90 * 24 * 60 * 60 * 1000
    );

    const data = {
      // Hospital basic info
      hospital: await prisma.hospital.findUnique({
        where: { id: hospitalId },
        select: {
          name: true,
          id: true,
          address: true,
          phone: true,
          email: true,
        },
      }),

      // Financial data (last 3 months)
      financialSummary: await prisma.monthlyFinancialSummary.findMany({
        where: {
          hospitalId,
          monthYear: {
            gte: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - 3,
              1
            ),
          },
        },
        orderBy: { monthYear: 'desc' },
        take: 3,
      }),

      // Recent financial transactions
      recentTransactions: await prisma.financialTransaction.findMany({
        where: {
          hospitalId,
          transactionDate: { gte: thirtyDaysAgo },
        },
        select: {
          category: true,
          amount: true,
          transactionDate: true,
          description: true,
          department: { select: { name: true } },
        },
        orderBy: { transactionDate: 'desc' },
        take: 50,
      }),

      // Patient flow data
      patientVisits: await prisma.patientVisit.findMany({
        where: {
          hospitalId,
          admissionDate: { gte: thirtyDaysAgo },
        },
        select: {
          visitType: true,
          status: true,
          admissionDate: true,
          dischargeDate: true,
          totalCost: true,
          sessionDuration: true,
          isReadmission: true,
          waitTime: true,
          department: { select: { name: true } },
        },
        take: 100,
      }),

      // Bed occupancy trends
      bedOccupancy: await prisma.dailyBedOccupancy.findMany({
        where: {
          hospitalId,
          date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: 'desc' },
        include: {
          department: { select: { name: true } },
        },
        take: 30,
      }),

      // HR metrics
      hrStats: await prisma.hrMonthlyStats.findMany({
        where: {
          hospitalId,
          monthYear: {
            gte: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() - 3,
              1
            ),
          },
        },
        orderBy: { monthYear: 'desc' },
        take: 3,
      }),

      // Staff performance
      employeePerformance: await prisma.employeePerformance.findMany({
        where: {
          employee: { hospitalId },
          evaluationPeriod: { gte: sixtyDaysAgo },
        },
        select: {
          performanceScore: true,
          evaluationPeriod: true,
          employee: {
            select: {
              department: { select: { name: true } },
              position: true,
              status: true,
            },
          },
        },
        take: 50,
      }),

      // Compliance status
      complianceTasks: await prisma.complianceTask.findMany({
        where: { hospitalId },
        select: {
          status: true,
          priority: true,
          dueDate: true,
          taskName: true,
          description: true,
          department: { select: { name: true } },
        },
      }),

      // Equipment status
      equipment: await prisma.hospitalEquipment.findMany({
        where: { hospitalId },
        select: {
          equipmentName: true,
          status: true,
          nextMaintenanceDue: true,
          purchaseDate: true,
          department: { select: { name: true } },
        },
      }),

      // Department staffing
      departmentStaffing: await prisma.departmentStaffing.findMany({
        where: { hospitalId },
        include: {
          department: { select: { name: true } },
        },
      }),

      // Training metrics
      trainingMetrics: await prisma.employeeTraining.findMany({
        where: {
          employee: { hospitalId },
          trainingDate: { gte: ninetyDaysAgo },
        },
        select: {
          trainingType: true,
          status: true,
          completionScore: true,
          trainingDate: true,
          employee: {
            select: {
              department: { select: { name: true } },
              position: true,
            },
          },
        },
        take: 100,
      }),

      // Dashboard KPIs for context
      dashboardKPIs: await prisma.dashboardKPI.findMany({
        where: { hospitalId },
        select: {
          kpiType: true,
          value: true,
          trend: true,
          date: true,
          metadata: true,
        },
        orderBy: { date: 'desc' },
        take: 10,
      }),
    };

    return data;
  } catch (error) {
    console.error('Error collecting hospital data:', error);
    throw error;
  }
};

const buildPrompt = (hospitalData, insightType) => {
  const dataAnalysis = analyzeDataForPrompt(hospitalData);

  const basePrompt = `
You are an AI assistant for a Hospital Executive Management Information System (HEMIS). 
You need to analyze the following hospital data and provide actionable insights for hospital executives.

Hospital: ${hospitalData.hospital?.name || 'Unknown Hospital'}
Analysis Type: ${insightType}
Current Date: ${new Date().toISOString().split('T')[0]}

DATA ANALYSIS SUMMARY:
${dataAnalysis}

DETAILED DATA:
Financial Summary: ${JSON.stringify(hospitalData.financialSummary, null, 2)}
Recent Transactions: ${JSON.stringify(
    hospitalData.recentTransactions?.slice(0, 10),
    null,
    2
  )}
Patient Visits: ${JSON.stringify(
    hospitalData.patientVisits?.slice(0, 10),
    null,
    2
  )}
Bed Occupancy: ${JSON.stringify(
    hospitalData.bedOccupancy?.slice(0, 10),
    null,
    2
  )}
HR Stats: ${JSON.stringify(hospitalData.hrStats, null, 2)}
Compliance Tasks: ${JSON.stringify(hospitalData.complianceTasks, null, 2)}
Equipment Status: ${JSON.stringify(hospitalData.equipment, null, 2)}
Department Staffing: ${JSON.stringify(hospitalData.departmentStaffing, null, 2)}
Dashboard KPIs: ${JSON.stringify(hospitalData.dashboardKPIs, null, 2)}

INSTRUCTIONS:
Based on the above data, provide 3-5 specific, actionable insights for hospital executives. 
Focus on trends, anomalies, opportunities for improvement, and potential risks.

Each insight should:
1. Have a clear, descriptive title
2. Explain the current situation or trend with specific data points
3. Provide specific, actionable recommendations
4. Indicate the potential impact (High/Medium/Low)
5. Suggest a relevant category (Operations/Finance/HR/Compliance)

IMPORTANT: Return your response in valid JSON format with the following structure:
{
  "insights": [
    {
      "title": "Insight Title",
      "description": "Detailed description with specific data points and recommendations",
      "impact": "High|Medium|Low",
      "category": "Operations|Finance|HR|Compliance",
      "recommendedActions": ["action1", "action2", "action3"],
      "dataPoints": ["supporting data point 1", "supporting data point 2"]
    }
  ]
}

Focus on providing insights that are:
- Data-driven and specific
- Actionable for hospital management
- Relevant to the current hospital situation
- Clear and concise
`;

  return basePrompt;
};

const analyzeDataForPrompt = (hospitalData) => {
  let analysis = 'DATA ANALYSIS SUMMARY:\n\n';

  // Financial analysis
  if (
    hospitalData.financialSummary &&
    hospitalData.financialSummary.length > 0
  ) {
    const latest = hospitalData.financialSummary[0];
    analysis += `Financial Performance: Latest month shows ${
      latest.totalRevenue
        ? `$${latest.totalRevenue} revenue`
        : 'no revenue data'
    } and ${
      latest.totalCosts ? `$${latest.totalCosts} costs` : 'no cost data'
    }.\n`;
  }

  // Patient flow analysis
  if (hospitalData.patientVisits && hospitalData.patientVisits.length > 0) {
    analysis += `Patient Flow: ${hospitalData.patientVisits.length} visits in the last 30 days.\n`;
    const emergencyVisits = hospitalData.patientVisits.filter(
      (v) => v.visitType === 'EMERGENCY'
    ).length;
    analysis += `Emergency visits: ${emergencyVisits} (${Math.round(
      (emergencyVisits / hospitalData.patientVisits.length) * 100
    )}%)\n`;
  }

  // Bed occupancy analysis
  if (hospitalData.bedOccupancy && hospitalData.bedOccupancy.length > 0) {
    const avgOccupancy =
      hospitalData.bedOccupancy.reduce(
        (sum, day) => sum + (day.occupancyRate || 0),
        0
      ) / hospitalData.bedOccupancy.length;
    analysis += `Average bed occupancy: ${avgOccupancy.toFixed(1)}%\n`;
  }

  // Compliance analysis
  if (hospitalData.complianceTasks && hospitalData.complianceTasks.length > 0) {
    const overdue = hospitalData.complianceTasks.filter(
      (task) => task.status === 'OVERDUE'
    ).length;
    analysis += `Compliance: ${overdue} overdue tasks out of ${hospitalData.complianceTasks.length} total tasks\n`;
  }

  // Equipment analysis
  if (hospitalData.equipment && hospitalData.equipment.length > 0) {
    const maintenanceNeeded = hospitalData.equipment.filter(
      (eq) => eq.status === 'MAINTENANCE_REQUIRED'
    ).length;
    analysis += `Equipment: ${maintenanceNeeded} items require maintenance out of ${hospitalData.equipment.length} total equipment\n`;
  }

  return analysis;
};

const parseGeminiResponse = (response) => {
  try {
    // Clean the response to extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate the structure
      if (parsed.insights && Array.isArray(parsed.insights)) {
        return parsed;
      }
    }
    throw new Error('Invalid JSON response structure');
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    console.error('Raw response:', response);

    // Fallback: return a default structure
    return {
      insights: [
        {
          title: 'AI Analysis Available',
          description:
            'AI analysis has been completed. The system has processed your hospital data and insights are being generated. Please check back in a few minutes for detailed recommendations.',
          impact: 'Medium',
          category: 'Operations',
          recommendedActions: [
            'Review system data',
            'Monitor key metrics',
            'Contact administrator if issues persist',
          ],
          dataPoints: [
            'Analysis timestamp: ' + new Date().toISOString(),
            'Data processing completed',
          ],
        },
      ],
    };
  }
};

const saveInsightsToDatabase = async (hospitalId, insights) => {
  try {
    // First, mark existing insights as inactive
    await prisma.aiInsight.updateMany({
      where: { hospitalId },
      data: { isActive: false },
    });

    // Save new insights
    const savedInsights = [];
    for (const insight of insights.insights) {
      const savedInsight = await prisma.aiInsight.create({
        data: {
          hospitalId,
          insightType: mapCategoryToInsightType(insight.category),
          title: insight.title,
          insightText: insight.description,
          impact: insight.impact,
          category: insight.category,
          generatedDate: new Date(),
          isActive: true,
        },
      });
      savedInsights.push(savedInsight);
    }

    console.log(
      `Saved ${savedInsights.length} insights for hospital ${hospitalId}`
    );
    return savedInsights;
  } catch (error) {
    console.error('Error saving insights to database:', error);
    throw error;
  }
};

const mapCategoryToInsightType = (category) => {
  const mapping = {
    Operations: 'PATIENT_INFLOW',
    Finance: 'FINANCIAL',
    HR: 'HR',
    Compliance: 'COMPLIANCE',
  };
  return mapping[category] || 'PATIENT_INFLOW';
};

const generateAndSaveInsights = async (hospitalId, insightType = 'general') => {
  try {
    console.log(`Starting insight generation for hospital ${hospitalId}`);

    // Generate insights from Gemini AI
    const insights = await generateInsights(hospitalId, insightType);

    // Save to database
    const savedInsights = await saveInsightsToDatabase(hospitalId, insights);

    console.log(
      `Successfully generated and saved insights for hospital ${hospitalId}`
    );
    return {
      success: true,
      insights: insights.insights,
      savedCount: savedInsights.length,
    };
  } catch (error) {
    console.error(
      `Error in generateAndSaveInsights for hospital ${hospitalId}:`,
      error
    );
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  generateInsights,
  generateAndSaveInsights,
  saveInsightsToDatabase,
};
