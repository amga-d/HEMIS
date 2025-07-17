const express = require('express');
const prisma = require('./services/prismaClient');

const app = express();
app.use(express.json());

// Test route without auth
app.get('/test-insights', async (req, res) => {
  try {
    const { hospitalId = '1', type = 'all' } = req.query;

    console.log(`Testing insights for hospital ${hospitalId}, type: ${type}`);

    // Get insights from database
    const dbInsights = await prisma.aiInsight.findMany({
      where: {
        hospitalId: hospitalId,
        ...(type !== 'all' && { insightType: type }),
      },
      orderBy: {
        generatedDate: 'desc',
      },
    });

    console.log(`Found ${dbInsights.length} insights in database`);

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
    console.error('Test insights error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
