// "use server";

// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import {
//   DynamoDBDocumentClient,
//   PutCommand,
//   QueryCommand,
//   ScanCommand,
//   GetCommand,
//   DeleteCommand,
// } from "@aws-sdk/lib-dynamodb";
// import { awsConfig, dynamoTables } from "./config";

// // Initialize DynamoDB client (server-side only)
// const client = new DynamoDBClient({
//   region: awsConfig.region,
//   ...(awsConfig.credentials && { credentials: awsConfig.credentials }),
// });

// const docClient = DynamoDBDocumentClient.from(client, {
//   marshallOptions: {
//     removeUndefinedValues: true,
//   },
// });

// // ==================== Resources Operations ====================

// export async function saveResource(resource: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.resources,
//     Item: {
//       id: resource.id,
//       createdAt: Date.now(),
//       ...resource
//     }
//   });

//   return await docClient.send(command);
// }

// export async function getResources(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.resources,
//     Limit: limit,
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// export async function getResourceById(id: string) {
//   const command = new GetCommand({
//     TableName: dynamoTables.resources,
//     Key: { id },
//   });

//   const response = await docClient.send(command);
//   return response.Item;
// }

// export async function deleteResource(id: string) {
//   const command = new DeleteCommand({
//     TableName: dynamoTables.resources,
//     Key: { id },
//   });

//   return await docClient.send(command);
// }

// // ==================== IAM Roles Operations ====================

// export async function saveIAMRole(role: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.iamRoles,
//     Item: {
//       id: role.id,
//       createdAt: Date.now(),
//       ...role,
//     },
//   });

//   return await docClient.send(command);
// }

// export async function getIAMRoles(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.iamRoles,
//     Limit: limit,
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// // ==================== IAM Users Operations ====================

// export async function saveIAMUser(user: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.iamUsers,
//     Item: {
//       id: user.id,
//       createdAt: Date.now(),
//       ...user,
//     },
//   });

//   return await docClient.send(command);
// }

// export async function getIAMUsers(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.iamUsers,
//     Limit: limit,
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// // ==================== AI Usage Operations ====================

// export async function saveAIUsage(usage: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.aiUsage,
//     Item: {
//       id: usage.id,
//       timestamp: Date.now(),
//       ...usage,
//     },
//   });

//   return await docClient.send(command);
// }

// export async function getAIUsage(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.aiUsage,
//     Limit: limit,
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// // ==================== WorkSpaces Operations ====================

// export async function saveWorkSpace(workspace: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.workspaces,
//     Item: {
//       id: workspace.id,
//       createdAt: Date.now(),
//       ...workspace,
//     },
//   });

//   return await docClient.send(command);
// }

// export async function getWorkSpaces(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.workspaces,
//     Limit: limit,
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// // ==================== Cost Operations ====================

// export async function saveCostData(cost: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.costs,
//     Item: {
//       date: cost.date,
//       ...cost
//     }
//   });

//   return await docClient.send(command);
// }

// export async function getCostData(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.costs,
//     Limit: limit
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }

// // ==================== Security Findings Operations ====================

// export async function saveSecurityFinding(finding: Record<string, unknown>) {
//   const command = new PutCommand({
//     TableName: dynamoTables.securityFindings,
//     Item: {
//       id: finding.id,
//       detectedAt: Date.now(),
//       ...finding
//     }
//   });

//   return await docClient.send(command);
// }

// export async function getSecurityFindings(limit: number = 100) {
//   const command = new ScanCommand({
//     TableName: dynamoTables.securityFindings,
//     Limit: limit
//   });

//   const response = await docClient.send(command);
//   return response.Items || [];
// }
