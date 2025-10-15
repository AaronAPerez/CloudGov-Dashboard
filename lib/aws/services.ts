// "use server";

// import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
// import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
// import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda";
// import { RDSClient, DescribeDBInstancesCommand } from "@aws-sdk/client-rds";
// import { DynamoDBClient, ListTablesCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
// import { awsConfig } from "./config";
// import type { AWSResource } from "@/lib/types";

// // Initialize AWS clients
// const ec2Client = new EC2Client({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// const s3Client = new S3Client({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// const lambdaClient = new LambdaClient({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// const rdsClient = new RDSClient({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// const dynamoClient = new DynamoDBClient({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// // ==================== EC2 Instances ====================

// export async function getEC2Instances(): Promise<AWSResource[]> {
//   try {
//     const command = new DescribeInstancesCommand({});
//     const response = await ec2Client.send(command);

//     const instances: AWSResource[] = [];

//     response.Reservations?.forEach((reservation) => {
//       reservation.Instances?.forEach((instance) => {
//         const nameTag = instance.Tags?.find((tag) => tag.Key === "Name");
//         instances.push({
//           id: instance.InstanceId || "",
//           name: nameTag?.Value || instance.InstanceId || "Unnamed Instance",
//           type: "EC2",
//           status: instance.State?.Name === "running" ? "running" : "stopped",
//           region: awsConfig.region,
//           monthlyCost: 50, // Estimate - in production, use AWS Cost Explorer API
//           createdAt: instance.LaunchTime || new Date(),
//           lastAccessed: new Date(),
//           owner: instance.Tags?.find((tag) => tag.Key === "Owner")?.Value || "Unknown",
//           tags: Object.fromEntries(
//             instance.Tags?.map((tag) => [tag.Key || "", tag.Value || ""]) || []
//           ),
//         });
//       });
//     });

//     return instances;
//   } catch (error) {
//     console.error("Error fetching EC2 instances:", error);
//     throw error;
//   }
// }

// // ==================== S3 Buckets ====================

// export async function getS3Buckets(): Promise<AWSResource[]> {
//   try {
//     const command = new ListBucketsCommand({});
//     const response = await s3Client.send(command);

//     const buckets: AWSResource[] = [];

//     for (const bucket of response.Buckets || []) {
//       buckets.push({
//         id: bucket.Name || "",
//         name: bucket.Name || "Unnamed Bucket",
//         type: "S3",
//         status: "running",
//         region: awsConfig.region,
//         monthlyCost: 5, // Estimate
//         createdAt: bucket.CreationDate || new Date(),
//         lastAccessed: new Date(),
//         owner: "Unknown",
//         tags: {
//           Service: "S3",
//           Type: "Storage",
//         },
//       });
//     }

//     return buckets;
//   } catch (error) {
//     console.error("Error fetching S3 buckets:", error);
//     throw error;
//   }
// }

// // ==================== Lambda Functions ====================

// export async function getLambdaFunctions(): Promise<AWSResource[]> {
//   try {
//     const command = new ListFunctionsCommand({});
//     const response = await lambdaClient.send(command);

//     const functions: AWSResource[] = [];

//     response.Functions?.forEach((fn) => {
//       functions.push({
//         id: fn.FunctionArn || "",
//         name: fn.FunctionName || "Unnamed Function",
//         type: "Lambda",
//         status: fn.State === "Active" ? "running" : "stopped",
//         region: awsConfig.region,
//         monthlyCost: 2, // Estimate
//         createdAt: new Date(fn.LastModified || Date.now()),
//         lastAccessed: new Date(),
//         owner: "Unknown",
//         tags: {},
//       });
//     });

//     return functions;
//   } catch (error) {
//     console.error("Error fetching Lambda functions:", error);
//     throw error;
//   }
// }

// // ==================== RDS Instances ====================

// export async function getRDSInstances(): Promise<AWSResource[]> {
//   try {
//     const command = new DescribeDBInstancesCommand({});
//     const response = await rdsClient.send(command);

//     const instances: AWSResource[] = [];

//     response.DBInstances?.forEach((db) => {
//       instances.push({
//         id: db.DBInstanceIdentifier || "",
//         name: db.DBInstanceIdentifier || "Unnamed DB",
//         type: "RDS",
//         status: db.DBInstanceStatus === "available" ? "running" : "stopped",
//         region: awsConfig.region,
//         monthlyCost: 100, // Estimate
//         createdAt: db.InstanceCreateTime || new Date(),
//         lastAccessed: new Date(),
//         owner: db.TagList?.find((tag) => tag.Key === "Owner")?.Value || "Unknown",
//         tags: Object.fromEntries(
//           db.TagList?.map((tag) => [tag.Key || "", tag.Value || ""]) || []
//         ),
//       });
//     });

//     return instances;
//   } catch (error) {
//     console.error("Error fetching RDS instances:", error);
//     throw error;
//   }
// }

// // ==================== DynamoDB Tables ====================

// export async function getDynamoDBTables(): Promise<AWSResource[]> {
//   try {
//     const listCommand = new ListTablesCommand({});
//     const listResponse = await dynamoClient.send(listCommand);

//     const tables: AWSResource[] = [];

//     for (const tableName of listResponse.TableNames || []) {
//       const describeCommand = new DescribeTableCommand({ TableName: tableName });
//       const describeResponse = await dynamoClient.send(describeCommand);
//       const table = describeResponse.Table;

//       if (table) {
//         tables.push({
//           id: table.TableArn || "",
//           name: table.TableName || "Unnamed Table",
//           type: "DynamoDB",
//           status: table.TableStatus === "ACTIVE" ? "running" : "pending",
//           region: awsConfig.region,
//           monthlyCost: 25, // Estimate
//           createdAt: table.CreationDateTime || new Date(),
//           lastAccessed: new Date(),
//           owner: "Unknown",
//           tags: {
//             Service: "DynamoDB",
//             Type: "Database",
//           },
//         });
//       }
//     }

//     return tables;
//   } catch (error) {
//     console.error("Error fetching DynamoDB tables:", error);
//     throw error;
//   }
// }

// // ==================== Get All Resources ====================

// export async function getAllAWSResources(): Promise<AWSResource[]> {
//   try {
//     const [ec2, s3, lambda, rds, dynamodb] = await Promise.allSettled([
//       getEC2Instances(),
//       getS3Buckets(),
//       getLambdaFunctions(),
//       getRDSInstances(),
//       getDynamoDBTables(),
//     ]);

//     const resources: AWSResource[] = [];

//     if (ec2.status === "fulfilled") resources.push(...ec2.value);
//     if (s3.status === "fulfilled") resources.push(...s3.value);
//     if (lambda.status === "fulfilled") resources.push(...lambda.value);
//     if (rds.status === "fulfilled") resources.push(...rds.value);
//     if (dynamodb.status === "fulfilled") resources.push(...dynamodb.value);

//     return resources;
//   } catch (error) {
//     console.error("Error fetching all AWS resources:", error);
//     throw error;
//   }
// }
