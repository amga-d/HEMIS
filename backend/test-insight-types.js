const axios = require('axios');

// Test different insight types
async function testInsightTypes() {
  const hospitalId = 'cmcvx4k900000980fv1hters8';
  const baseUrl = 'http://localhost:3000';

  try {
    // Login
    const loginResponse = await axios.post(
      `${baseUrl}/api/user/login`,
      {
        username: 'testuser',
        password: 'password123',
      },
      {
        withCredentials: true,
      }
    );

    const cookies = loginResponse.headers['set-cookie'];

    const authenticatedAxios = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
      headers: {
        Cookie: cookies ? cookies.join('; ') : '',
      },
    });

    const insightTypes = [
      'optimization',
      'prediction',
      'compliance',
      'financial',
    ];

    for (const type of insightTypes) {
      console.log(`\n=== Testing ${type} insights ===`);

      // Generate insights
      const generateResponse = await authenticatedAxios.post(
        '/api/analytics/insights/generate',
        {
          hospitalId,
          insightType: type,
        }
      );

      console.log(`✅ Generated ${type} insights:`, generateResponse.data);

      // Wait a bit then fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fetchResponse = await authenticatedAxios.get(
        `/api/analytics/insights/${type}?hospitalId=${hospitalId}`
      );
      console.log(`✅ Fetched ${fetchResponse.data.length} ${type} insights`);

      if (fetchResponse.data.length > 0) {
        console.log(`Sample insight: ${fetchResponse.data[0].title}`);
      }
    }

    console.log('\n🎉 All insight types tested successfully!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testInsightTypes();
