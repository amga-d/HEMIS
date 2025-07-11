#!/usr/bin/env node

// Simple test script to verify JWT authentication
const baseUrl = 'http://localhost:3000';

async function testAuth() {
  console.log('🧪 Testing JWT Authentication Flow...\n');

  try {
    // Test 1: Try to access protected route without authentication
    console.log('1. Testing protected route without auth...');
    const unauthedResponse = await fetch(`${baseUrl}/api/dashboard/kpis?hospitalId=default`, {
      credentials: 'include'
    });
    console.log(`   Status: ${unauthedResponse.status} ${unauthedResponse.statusText}`);
    
    // Test 2: Login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${baseUrl}/api/user/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      })
    });

    console.log(`   Status: ${loginResponse.status} ${loginResponse.statusText}`);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log(`   Response: ${JSON.stringify(loginData)}`);
      
      // Extract cookies
      const cookies = loginResponse.headers.get('set-cookie');
      console.log(`   Cookies: ${cookies}`);
      
      // Test 3: Try to access protected route with authentication
      console.log('\n3. Testing protected route with auth...');
      const authedResponse = await fetch(`${baseUrl}/api/dashboard/kpis?hospitalId=default`, {
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });
      console.log(`   Status: ${authedResponse.status} ${authedResponse.statusText}`);
      
      // Test 4: Test /me endpoint
      console.log('\n4. Testing /me endpoint...');
      const meResponse = await fetch(`${baseUrl}/api/user/me`, {
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });
      console.log(`   Status: ${meResponse.status} ${meResponse.statusText}`);
      
      if (meResponse.ok) {
        const userData = await meResponse.json();
        console.log(`   User data: ${JSON.stringify(userData)}`);
      }
      
      // Test 5: Logout
      console.log('\n5. Testing logout...');
      const logoutResponse = await fetch(`${baseUrl}/api/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cookie': cookies || ''
        }
      });
      console.log(`   Status: ${logoutResponse.status} ${logoutResponse.statusText}`);
      
    } else {
      console.log('   Login failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth();
