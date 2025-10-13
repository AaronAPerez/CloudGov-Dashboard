import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,

  // Exclude AWS SDK from client-side bundle
  serverExternalPackages: [
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
    '@aws-sdk/client-ec2',
    '@aws-sdk/client-s3',
    '@aws-sdk/client-cloudwatch'
  ]
};

export default nextConfig;
