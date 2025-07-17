const axios = require('axios');

// Test the Gemini AI integration
async function testGeminiIntegration() {
  const hospitalId = 'cmcvx4k900000980fv1hters8'; // From database
  const baseUrl = 'http://localhost:3000';

  console.log('Testing Gemini AI Integration...\n');

  try {
    // First, login to get authentication
    console.log('0. Logging in...');
    const loginResponse = await axios.post(`${baseUrl}/api/user/login`, {
      username: 'testuser',
      password: 'password123',
    });

    const authCookie = loginResponse.headers['set-cookie'];
    console.log('✅ Login successful');

    // Configure axios to use the auth cookie
    const authenticatedAxios = axios.create({
      baseURL: baseUrl,
      headers: {
        Cookie: authCookie ? authCookie.join('; ') : '',
      },
    });

    // Test 1: Generate insights manually
    console.log('1. Testing manual insight generation...');
    const generateResponse = await authenticatedAxios.post(
      `/api/analytics/insights/generate`,
      {
        hospitalId,
        insightType: 'optimization',
      }
    );
    console.log('✅ Manual generation:', generateResponse.data);
    console.log('');

    // Wait a bit for the insights to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: Fetch insights
    console.log('2. Testing insight fetching...');
    const fetchResponse = await authenticatedAxios.get(
      `/api/analytics/insights/optimization?hospitalId=${hospitalId}`
    );
    console.log('✅ Fetched insights:', fetchResponse.data.length, 'insights');
    if (fetchResponse.data.length > 0) {
      console.log('First insight:', fetchResponse.data[0]);
    }
    console.log('');

    // Test 3: Check scheduler status
    console.log('3. Testing scheduler status...');
    const statusResponse = await authenticatedAxios.get(
      `/api/analytics/scheduler/status`
    );
    console.log('✅ Scheduler status:', statusResponse.data);
    console.log('');

    console.log('All tests passed! 🎉');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log(
        '💡 Authentication required. Make sure the backend is running and you have valid credentials.'
      );
    }
  }
}

testGeminiIntegration();
