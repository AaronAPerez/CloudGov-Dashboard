/**
 * AWS SDK Connection Test Script
 * Tests AWS SDK connectivity with current credentials
 */

require('dotenv').config({ path: '.env.local' });
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');

async function testConnection() {
  console.log('='.repeat(60));
  console.log('AWS SDK Connection Test');
  console.log('='.repeat(60));
  console.log();

  // Check environment variables
  console.log('Environment Variables:');
  console.log('  AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
  console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? `SET (${process.env.AWS_ACCESS_KEY_ID.substring(0, 10)}...)` : 'NOT SET');
  console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET (hidden)' : 'NOT SET');
  console.log();

  const config = {
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };

  // Test 1: STS Get Caller Identity
  console.log('Test 1: STS Get Caller Identity');
  try {
    const stsClient = new STSClient(config);
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    console.log('  ✅ SUCCESS');
    console.log('  Account:', response.Account);
    console.log('  UserId:', response.UserId);
    console.log('  Arn:', response.Arn);
  } catch (error) {
    console.log('  ❌ FAILED');
    console.log('  Error:', error.name);
    console.log('  Message:', error.message);
  }
  console.log();

  // Test 2: EC2 Describe Instances
  console.log('Test 2: EC2 Describe Instances');
  try {
    const ec2Client = new EC2Client(config);
    const command = new DescribeInstancesCommand({ MaxResults: 5 });
    const response = await ec2Client.send(command);
    console.log('  ✅ SUCCESS');
    console.log('  Reservations found:', response.Reservations?.length || 0);
  } catch (error) {
    console.log('  ❌ FAILED');
    console.log('  Error:', error.name);
    console.log('  Message:', error.message);
    if (error.$metadata) {
      console.log('  HTTP Status:', error.$metadata.httpStatusCode);
    }
  }
  console.log();

  // Test 3: S3 List Buckets
  console.log('Test 3: S3 List Buckets');
  try {
    const s3Client = new S3Client(config);
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log('  ✅ SUCCESS');
    console.log('  Buckets found:', response.Buckets?.length || 0);
  } catch (error) {
    console.log('  ❌ FAILED');
    console.log('  Error:', error.name);
    console.log('  Message:', error.message);
    if (error.$metadata) {
      console.log('  HTTP Status:', error.$metadata.httpStatusCode);
    }
  }
  console.log();

  console.log('='.repeat(60));
}

testConnection().catch(console.error);
