import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function grantPremiumAccess(email: string) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').findOneAndUpdate(
      { email },
      {
        $set: {
          'subscription.plan': 'premium',
          'subscription.status': 'active',
          'subscription.currentPeriodStart': new Date(),
          'subscription.currentPeriodEnd': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          'subscription.cancelAtPeriodEnd': false,
        },
      },
      { returnDocument: 'after' }
    );

    if (result) {
      console.log('\n✅ Premium access granted successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', result.email);
      console.log('Name:', result.firstName, result.lastName);
      console.log('Plan:', result.subscription?.plan);
      console.log('Status:', result.subscription?.status);
      console.log('Valid until:', result.subscription?.currentPeriodEnd);
    } else {
      console.log('\n❌ User not found with email:', email);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument or use default
const email = process.argv[2] || 'sajal@gmail.com';
grantPremiumAccess(email);
