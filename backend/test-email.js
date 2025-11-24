// Test email configuration
require('dotenv').config();
const { sendOTPEmail } = require('./utils/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  console.log('Environment Variables:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ EMAIL_USER or EMAIL_PASS not set in .env file');
    process.exit(1);
  }

  try {
    console.log('Sending test email...\n');
    await sendOTPEmail(
      process.env.EMAIL_USER, // Send to yourself for testing
      '123456',
      'Test User'
    );
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log('Check your inbox:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('\n❌ FAILED! Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure 2FA is enabled on your Gmail account');
    console.error('2. Generate App Password at: https://myaccount.google.com/apppasswords');
    console.error('3. Remove spaces from app password in .env file');
    console.error('4. Make sure EMAIL_USER is correct');
  }
  
  process.exit(0);
}

testEmail();
