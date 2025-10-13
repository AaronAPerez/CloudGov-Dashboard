"use server";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client (server-side only)
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const docClient = DynamoDBDocumentClient.from(client);

// Save resource to DynamoDB
export async function saveResource(resource: Record<string, unknown>) {
  const command = new PutCommand({
    TableName: "CloudGovResources",
    Item: {
      id: resource.id,
      createdAt: Date.now(),
      ...resource
    }
  });

  return await docClient.send(command);
}

// Get all resources
export async function getResources() {
  const command = new ScanCommand({
    TableName: "CloudGovResources",
    Limit: 100 // Stay within free tier
  });

  const response = await docClient.send(command);
  return response.Items || [];
}

// Get resource by ID
export async function getResourceById(id: string) {
  const command = new QueryCommand({
    TableName: "CloudGovResources",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  });

  const response = await docClient.send(command);
  return response.Items?.[0] || null;
}

// Save cost data to DynamoDB
export async function saveCost(costData: Record<string, unknown>) {
  const command = new PutCommand({
    TableName: "CloudGovCosts",
    Item: {
      date: costData.date,
      ...costData
    }
  });

  return await docClient.send(command);
}

// Get costs
export async function getCosts() {
  const command = new ScanCommand({
    TableName: "CloudGovCosts",
    Limit: 100
  });

  const response = await docClient.send(command);
  return response.Items || [];
}

// Save security finding to DynamoDB
export async function saveSecurityFinding(finding: Record<string, unknown>) {
  const command = new PutCommand({
    TableName: "CloudGovSecurityFindings",
    Item: {
      id: finding.id,
      detectedAt: Date.now(),
      ...finding
    }
  });

  return await docClient.send(command);
}

// Get security findings
export async function getSecurityFindings() {
  const command = new ScanCommand({
    TableName: "CloudGovSecurityFindings",
    Limit: 100
  });

  const response = await docClient.send(command);
  return response.Items || [];
}
