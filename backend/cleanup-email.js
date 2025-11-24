// Cleanup script to check and remove email from database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const TempUser = require('./models/tempUser');

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node cleanup-email.js email@example.com');
  process.exit(1);
}

async function cleanup() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected!\n');

    console.log(`🔍 Checking for email: ${email}\n`);

    // Check User collection
    const user = await User.findOne({ email });
    if (user) {
      console.log('📧 Found in User collection (Verified Account):');
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Verified:', user.isEmailVerified);
      console.log('  Created:', user.createdAt);
      console.log('\n❓ Delete this user? (y/n)');
      
      // For now, just show info
      console.log('⚠️  To delete, run: User.deleteOne({ email: "' + email + '" })');
    } else {
      console.log('✅ Not found in User collection');
    }

    // Check TempUser collection
    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      console.log('\n📧 Found in TempUser collection (Pending Verification):');
      console.log('  Name:', tempUser.name);
      console.log('  Role:', tempUser.role);
      console.log('  OTP:', tempUser.otp);
      console.log('  Created:', tempUser.createdAt);
      console.log('\n🗑️  Deleting TempUser...');
      
      await TempUser.deleteOne({ email });
      console.log('✅ TempUser deleted! You can now sign up again.');
    } else {
      console.log('✅ Not found in TempUser collection');
    }

    if (!user && !tempUser) {
      console.log('\n✅ Email is available! You can sign up with this email.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

cleanup();
