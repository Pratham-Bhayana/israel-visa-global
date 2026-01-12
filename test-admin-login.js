const axios = require('axios');

const BASE_URL = 'https://israel-visa-global-production.up.railway.app/api';

// Test credentials
const testCredentials = [
  { email: 'rohitdubey@adminisrael.com', password: 'rohitdubey@2025', name: 'Rohit Dubey' },
  { email: 'seoraizinggroup@adminisrael.com', password: 'seoraizinggroup@2025', name: 'SEO Raizing Group' },
  { email: 'testingteam@adminisrael.com', password: 'testingteam@2025', name: 'Testing Team' },
  { email: 'bsr@adminisrael.com', password: 'bsr@2025', name: 'BSR' },
];

async function testAuthSystem() {
  console.log('🔍 Testing Authentication System...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Endpoint...');
  try {
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthRes.data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }

  console.log('\n');

  // Test 2: Auth Test Endpoint
  console.log('2️⃣ Testing Auth System Status...');
  try {
    const authTestRes = await axios.get(`${BASE_URL}/auth/test`);
    console.log('✅ Auth System Status:', JSON.stringify(authTestRes.data, null, 2));
    
    if (!authTestRes.data.status.jwtSecretConfigured) {
      console.log('\n⚠️  WARNING: JWT_SECRET is NOT configured on Railway!');
      console.log('   This will cause login to fail.');
      console.log('   Please set JWT_SECRET in Railway environment variables.');
    }
    
    if (authTestRes.data.status.adminUsers === 0) {
      console.log('\n⚠️  WARNING: No admin users found in database!');
    } else {
      console.log(`\n✅ Found ${authTestRes.data.status.adminUsers} admin user(s)`);
    }
  } catch (error) {
    console.log('❌ Auth Test Failed:', error.response?.data || error.message);
  }

  console.log('\n');

  // Test 3: Try Login with Each Credential
  console.log('3️⃣ Testing Login with Admin Credentials...\n');
  
  for (const cred of testCredentials) {
    console.log(`Testing: ${cred.name} (${cred.email})`);
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: cred.email,
        password: cred.password,
      });
      
      console.log(`✅ SUCCESS for ${cred.name}`);
      console.log('   Token received:', loginRes.data.token ? 'YES' : 'NO');
      console.log('   User role:', loginRes.data.user?.role);
      console.log('');
    } catch (error) {
      console.log(`❌ FAILED for ${cred.name}`);
      console.log('   Status:', error.response?.status);
      console.log('   Error:', error.response?.data?.message || error.message);
      
      if (error.response?.status === 500) {
        console.log('   Details:', error.response?.data?.error);
      }
      console.log('');
    }
  }
}

// Run tests
testAuthSystem().then(() => {
  console.log('\n✅ Test completed!');
}).catch((error) => {
  console.error('\n❌ Test script error:', error.message);
});
