// AWS Configuration
export const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
};

// DynamoDB Table Names
export const dynamoTables = {
  resources: process.env.DYNAMODB_RESOURCES_TABLE || "CloudGovResources",
  costs: process.env.DYNAMODB_COSTS_TABLE || "CloudGovCosts",
  securityFindings: process.env.DYNAMODB_SECURITY_TABLE || "CloudGovSecurityFindings",
  iamRoles: process.env.DYNAMODB_IAM_ROLES_TABLE || "CloudGovIAMRoles",
  iamUsers: process.env.DYNAMODB_IAM_USERS_TABLE || "CloudGovIAMUsers",
  aiUsage: process.env.DYNAMODB_AI_USAGE_TABLE || "CloudGovAIUsage",
  workspaces: process.env.DYNAMODB_WORKSPACES_TABLE || "CloudGovWorkSpaces",
};

// S3 Configuration
export const s3Config = {
  bucket: process.env.S3_BUCKET_NAME || "cloudgov-dashboard-assets",
};

// Feature Flags
export const features = {
  useRealAWS: process.env.USE_REAL_AWS === "true",
  enableMockData: process.env.ENABLE_MOCK_DATA !== "false", // Default to true for development
};
