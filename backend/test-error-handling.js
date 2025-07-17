const axios = require('axios');

// Test error handling when no insights available
async function testErrorHandling() {
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

    console.log('Testing API when no insights are available...\n');

    // Test fetching insights when none exist and set future time to disable auto-generation
    try {
      const response = await authenticatedAxios.get(
        `/api/analytics/insights/optimization?hospitalId=${hospitalId}`
      );
      console.log('✅ Unexpected success:', response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Correct error handling - 404 returned');
        console.log('Error response:', error.response.data);
      } else {
        console.log(
          '❌ Unexpected error:',
          error.response?.data || error.message
        );
      }
    }

    console.log('\n🎉 Error handling test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testErrorHandling();
