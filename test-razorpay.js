#!/usr/bin/env node

/**
 * Quick Test Script for Razorpay Integration
 * This script verifies the Razorpay service is configured correctly
 */

require('dotenv').config({ path: './backend/.env' });
const { createOrder } = require('./backend/services/razorpayService');

async function testRazorpayIntegration() {
  console.log('🔍 Testing Razorpay Integration...\n');

  // Check environment variables
  console.log('1️⃣ Checking Environment Variables:');
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('❌ Error: Razorpay credentials not found in environment variables!');
    console.log('\n📝 Please add the following to your backend/.env file:');
    console.log('RAZORPAY_KEY_ID=rzp_live_S6rRrTChk9nKmm');
    console.log('RAZORPAY_KEY_SECRET=FueOCAesfJKbuVHdiTOFpPhp\n');
    process.exit(1);
  }

  console.log(`✅ RAZORPAY_KEY_ID: ${keyId.substring(0, 8)}...`);
  console.log(`✅ RAZORPAY_KEY_SECRET: ${keySecret.substring(0, 4)}...\n`);

  // Test order creation
  console.log('2️⃣ Testing Order Creation:');
  try {
    const testAmount = 100; // ₹100 for testing
    const receipt = `test_${Date.now()}`;
    const result = await createOrder(testAmount, 'INR', receipt, {
      test: true,
      purpose: 'Integration Test',
    });

    if (result.success) {
      console.log('✅ Order created successfully!');
      console.log(`   Order ID: ${result.order.id}`);
      console.log(`   Amount: ₹${result.order.amount / 100}`);
      console.log(`   Currency: ${result.order.currency}`);
      console.log(`   Status: ${result.order.status}\n`);
      
      console.log('🎉 Razorpay integration is working correctly!');
      console.log('\n📌 Next Steps:');
      console.log('   1. Deploy your backend with the environment variables');
      console.log('   2. Test the payment flow on your frontend');
      console.log('   3. Monitor payments in Razorpay Dashboard');
    } else {
      console.error('❌ Order creation failed:', result.error);
      console.log('\n📝 Possible issues:');
      console.log('   - Invalid API credentials');
      console.log('   - Network connectivity issues');
      console.log('   - Razorpay service temporarily unavailable\n');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testRazorpayIntegration();
