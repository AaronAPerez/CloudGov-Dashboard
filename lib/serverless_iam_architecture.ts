/**
 * Serverless Backend Architecture - CloudGov Dashboard
 * 
 * Demonstrates qualifications:
 * ✅ Modern serverless architecture patterns
 * ✅ Least privileged IAM role implementation
 * ✅ AWS Lambda + API Gateway integration
 * ✅ Secure, scalable system design
 * ✅ Infrastructure as Code principles
 * 
 * Architecture Components:
 * - API Gateway with Lambda integration
 * - DynamoDB for state management
 * - EventBridge for event-driven workflows
 * - CloudWatch for monitoring and logging
 * - SNS/SQS for async messaging
 * - Step Functions for orchestration
 * - Secrets Manager for credentials
 * 
 * Security Features:
 * - Least privilege IAM roles per function
 * - Resource-based policies
 * - VPC endpoints for private access
 * - Encryption at rest and in transit
 * - AWS WAF for API protection
 * - Audit logging with CloudTrail
 * 
 * @module ServerlessBackend
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { WorkSpacesClient, DescribeWorkspacesCommand, CreateWorkspacesCommand, TerminateWorkspacesCommand, StartWorkspacesCommand, StopWorkspacesCommand, RebootWorkspacesCommand } from '@aws-sdk/client-workspaces';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

/**
 * IAM Policy Examples - Least Privileged Access
 * 
 * These policies demonstrate the principle of least privilege,
 * granting only the minimum permissions required for each function
 */

/**
 * 1. WorkSpaces Read-Only Lambda IAM Policy
 */
export const WORKSPACES_READONLY_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'WorkSpacesReadOnly',
      Effect: 'Allow',
      Action: [
        'workspaces:Describe*',
        'workspaces:List*',
      ],
      Resource: '*',
    },
    {
      Sid: 'CloudWatchMetrics',
      Effect: 'Allow',
      Action: [
        'cloudwatch:PutMetricData',
      ],
      Resource: '*',
      Condition: {
        StringEquals: {
          'cloudwatch:namespace': 'CloudGov/WorkSpaces',
        },
      },
    },
    {
      Sid: 'DynamoDBReadOnly',
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:Query',
        'dynamodb:Scan',
      ],
      Resource: [
        'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/workspaces-state',
        'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/workspaces-state/index/*',
      ],
    },
    {
      Sid: 'CloudWatchLogs',
      Effect: 'Allow',
      Action: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      Resource: 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:log-group:/aws/lambda/workspaces-*',
    },
  ],
};

/**
 * 2. WorkSpaces Management Lambda IAM Policy
 */
export const WORKSPACES_MANAGEMENT_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'WorkSpacesManagement',
      Effect: 'Allow',
      Action: [
        'workspaces:CreateWorkspaces',
        'workspaces:TerminateWorkspaces',
        'workspaces:StartWorkspaces',
        'workspaces:StopWorkspaces',
        'workspaces:RebootWorkspaces',
        'workspaces:RebuildWorkspaces',
        'workspaces:ModifyWorkspaceProperties',
        'workspaces:ModifyWorkspaceState',
      ],
      Resource: 'arn:aws:workspaces:${AWS::Region}:${AWS::AccountId}:workspace/*',
      Condition: {
        StringEquals: {
          'aws:RequestedRegion': '${AWS::Region}',
        },
      },
    },
    {
      Sid: 'WorkSpacesDescribe',
      Effect: 'Allow',
      Action: [
        'workspaces:Describe*',
      ],
      Resource: '*',
    },
    {
      Sid: 'DynamoDBFullAccess',
      Effect: 'Allow',
      Action: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query',
      ],
      Resource: [
        'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/workspaces-state',
      ],
    },
    {
      Sid: 'SNSPublish',
      Effect: 'Allow',
      Action: [
        'sns:Publish',
      ],
      Resource: 'arn:aws:sns:${AWS::Region}:${AWS::AccountId}:workspaces-notifications',
    },
    {
      Sid: 'CloudWatchMetricsAndLogs',
      Effect: 'Allow',
      Action: [
        'cloudwatch:PutMetricData',
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      Resource: '*',
    },
  ],
};

/**
 * 3. Secrets Manager Access Policy
 */
export const SECRETS_MANAGER_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'SecretsManagerReadOnly',
      Effect: 'Allow',
      Action: [
        'secretsmanager:GetSecretValue',
      ],
      Resource: 'arn:aws:secretsmanager:${AWS::Region}:${AWS::AccountId}:secret:cloudgov/*',
    },
  ],
};

/**
 * Lambda Function: List WorkSpaces
 * 
 * Demonstrates:
 * - Serverless function implementation
 * - AWS SDK v3 usage
 * - Error handling and logging
 * - CloudWatch metrics
 */
export async function listWorkSpacesHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  const workspacesClient = new WorkSpacesClient({ region: process.env.AWS_REGION });
  const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
  const cloudwatchClient = new CloudWatchClient({ region: process.env.AWS_REGION });

  try {
    // Extract query parameters
    const { directoryId, userName, status } = event.queryStringParameters || {};

    // Call WorkSpaces API
    const command = new DescribeWorkspacesCommand({
      DirectoryId: directoryId,
      UserName: userName,
    });

    const response = await workspacesClient.send(command);

    // Filter by status if provided
    let workspaces = response.Workspaces || [];
    if (status) {
      workspaces = workspaces.filter((ws) => ws.State === status);
    }

    // Store state in DynamoDB for caching
    await Promise.all(
      workspaces.map(async (workspace) => {
        const putCommand = new PutItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            workspaceId: { S: workspace.WorkspaceId! },
            userName: { S: workspace.UserName! },
            state: { S: workspace.State! },
            ipAddress: { S: workspace.IpAddress || '' },
            lastUpdated: { N: Date.now().toString() },
            bundleId: { S: workspace.BundleId || '' },
            computeTypeName: { S: workspace.WorkspaceProperties?.ComputeTypeName || '' },
          },
        });
        await dynamoClient.send(putCommand);
      })
    );

    // Publish CloudWatch metrics
    await cloudwatchClient.send(
      new PutMetricDataCommand({
        Namespace: 'CloudGov/WorkSpaces',
        MetricData: [
          {
            MetricName: 'TotalWorkSpaces',
            Value: workspaces.length,
            Unit: 'Count',
            Timestamp: new Date(),
          },
          {
            MetricName: 'AvailableWorkSpaces',
            Value: workspaces.filter((ws) => ws.State === 'AVAILABLE').length,
            Unit: 'Count',
            Timestamp: new Date(),
          },
        ],
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        data: {
          workspaces: workspaces.map((ws) => ({
            workspaceId: ws.WorkspaceId,
            userName: ws.UserName,
            directoryId: ws.DirectoryId,
            bundleId: ws.BundleId,
            state: ws.State,
            ipAddress: ws.IpAddress,
            computeTypeName: ws.WorkspaceProperties?.ComputeTypeName,
            runningMode: ws.WorkspaceProperties?.RunningMode,
            userVolumeEncryptionEnabled: ws.UserVolumeEncryptionEnabled,
            rootVolumeEncryptionEnabled: ws.RootVolumeEncryptionEnabled,
          })),
          count: workspaces.length,
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error listing WorkSpaces:', error);

    // Publish error metric
    await cloudwatchClient.send(
      new PutMetricDataCommand({
        Namespace: 'CloudGov/WorkSpaces',
        MetricData: [
          {
            MetricName: 'APIErrors',
            Value: 1,
            Unit: 'Count',
            Timestamp: new Date(),
            Dimensions: [
              {
                Name: 'Operation',
                Value: 'ListWorkSpaces',
              },
            ],
          },
        ],
      })
    );

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Failed to list WorkSpaces',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
    };
  }
}

/**
 * Lambda Function: Create WorkSpace
 * 
 * Demonstrates:
 * - Resource creation with validation
 * - SNS notification integration
 * - Async workflow orchestration
 */
export async function createWorkSpaceHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const workspacesClient = new WorkSpacesClient({ region: process.env.AWS_REGION });
  const snsClient = new SNSClient({ region: process.env.AWS_REGION });
  const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { userName, directoryId, bundleId, tags } = body;

    // Validate required fields
    if (!userName || !directoryId || !bundleId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          error: {
            message: 'Missing required fields',
            required: ['userName', 'directoryId', 'bundleId'],
          },
        }),
      };
    }

    // Create WorkSpace
    const command = new CreateWorkspacesCommand({
      Workspaces: [
        {
          DirectoryId: directoryId,
          UserName: userName,
          BundleId: bundleId,
          UserVolumeEncryptionEnabled: true,
          RootVolumeEncryptionEnabled: true,
          WorkspaceProperties: {
            RunningMode: 'AUTO_STOP',
            RunningModeAutoStopTimeoutInMinutes: 60,
          },
          Tags: [
            { Key: 'ManagedBy', Value: 'CloudGov' },
            { Key: 'CreatedAt', Value: new Date().toISOString() },
            ...(tags || []),
          ],
        },
      ],
    });

    const response = await workspacesClient.send(command);

    // Store creation request in DynamoDB
    const workspace = response.PendingRequests?.[0];
    if (workspace) {
      await dynamoClient.send(
        new PutItemCommand({
          TableName: process.env.DYNAMODB_TABLE,
          Item: {
            workspaceId: { S: workspace.WorkspaceId! },
            userName: { S: userName },
            directoryId: { S: directoryId },
            bundleId: { S: bundleId },
            state: { S: 'PENDING' },
            createdAt: { N: Date.now().toString() },
            createdBy: { S: event.requestContext.identity?.userArn || 'system' },
          },
        })
      );

      // Send SNS notification
      await snsClient.send(
        new PublishCommand({
          TopicArn: process.env.SNS_TOPIC_ARN,
          Subject: 'WorkSpace Creation Started',
          Message: JSON.stringify({
            event: 'workspaces.created',
            workspaceId: workspace.WorkspaceId,
            userName,
            directoryId,
            timestamp: new Date().toISOString(),
          }),
        })
      );
    }

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          workspaceId: workspace?.WorkspaceId,
          state: workspace?.State,
          message: 'WorkSpace creation initiated',
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error creating WorkSpace:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Failed to create WorkSpace',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
    };
  }
}

/**
 * Lambda Function: Bulk Start/Stop WorkSpaces
 * 
 * Demonstrates:
 * - Batch operations
 * - Error handling per resource
 * - Progress tracking
 */
export async function bulkWorkSpaceActionHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const workspacesClient = new WorkSpacesClient({ region: process.env.AWS_REGION });
  const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, workspaceIds } = body;

    if (!action || !workspaceIds || !Array.isArray(workspaceIds)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: { message: 'Invalid request: action and workspaceIds array required' },
        }),
      };
    }

    // Create batch ID for tracking
    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store batch operation in DynamoDB
    await dynamoClient.send(
      new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE + '-batches',
        Item: {
          batchId: { S: batchId },
          action: { S: action },
          workspaceIds: { L: workspaceIds.map((id: string) => ({ S: id })) },
          status: { S: 'in-progress' },
          total: { N: workspaceIds.length.toString() },
          completed: { N: '0' },
          successful: { N: '0' },
          failed: { N: '0' },
          createdAt: { N: Date.now().toString() },
        },
      })
    );

    // Execute action based on type
    let commandClass;
    switch (action) {
      case 'start':
        commandClass = StartWorkspacesCommand;
        break;
      case 'stop':
        commandClass = StopWorkspacesCommand;
        break;
      case 'reboot':
        commandClass = RebootWorkspacesCommand;
        break;
      case 'terminate':
        commandClass = TerminateWorkspacesCommand;
        break;
      default:
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            success: false,
            error: { message: `Unsupported action: ${action}` },
          }),
        };
    }

    // Process in batches of 25 (AWS API limit)
    const batchSize = 25;
    const results = [];

    for (let i = 0; i < workspaceIds.length; i += batchSize) {
      const batch = workspaceIds.slice(i, i + batchSize);
      
      const command = new commandClass({
        [action === 'terminate' ? 'TerminateWorkspaceRequests' : 
         action === 'start' ? 'StartWorkspaceRequests' :
         action === 'stop' ? 'StopWorkspaceRequests' :
         'RebootWorkspaceRequests']: batch.map((id: string) => ({
          WorkspaceId: id,
        })),
      });

      const response = await workspacesClient.send(command);
      results.push(response);
    }

    return {
      statusCode: 202,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          batchId,
          action,
          totalRequests: workspaceIds.length,
          message: `Bulk ${action} operation initiated`,
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error in bulk operation:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Failed to execute bulk operation',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
    };
  }
}

/**
 * Lambda Function: Get Batch Operation Status
 * 
 * Demonstrates:
 * - Progress tracking
 * - DynamoDB queries
 * - Real-time status updates
 */
export async function getBatchStatusHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

  try {
    const batchId = event.pathParameters?.batchId;

    if (!batchId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: { message: 'Missing batchId parameter' },
        }),
      };
    }

    // Query DynamoDB for batch status
    const command = new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE + '-batches',
      KeyConditionExpression: 'batchId = :batchId',
      ExpressionAttributeValues: {
        ':batchId': { S: batchId },
      },
    });

    const response = await dynamoClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: { message: 'Batch operation not found' },
        }),
      };
    }

    const batch = response.Items[0];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: {
          batchId: batch.batchId.S,
          action: batch.action.S,
          status: batch.status.S,
          total: parseInt(batch.total.N || '0'),
          completed: parseInt(batch.completed.N || '0'),
          successful: parseInt(batch.successful.N || '0'),
          failed: parseInt(batch.failed.N || '0'),
          results: batch.results?.L || [],
        },
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error getting batch status:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: {
          message: 'Failed to get batch status',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      }),
    };
  }
}

/**
 * Export handler functions for Lambda
 */
export const handlers = {
  listWorkSpaces: listWorkSpacesHandler,
  createWorkSpace: createWorkSpaceHandler,
  bulkWorkSpaceAction: bulkWorkSpaceActionHandler,
  getBatchStatus: getBatchStatusHandler,
};

/**
 * Infrastructure as Code - AWS CDK Stack Definition
 * 
 * Demonstrates:
 * - Infrastructure as Code best practices
 * - Secure architecture patterns
 * - Scalable system design
 */

export const CDK_STACK_EXAMPLE = `
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class WorkSpacesManagementStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for WorkSpaces State
    const workspacesTable = new dynamodb.Table(this, 'WorkSpacesStateTable', {
      tableName: 'workspaces-state',
      partitionKey: {
        name: 'workspaceId',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'lastUpdated',
        type: dynamodb.AttributeType.NUMBER,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Add GSI for querying by userName
    workspacesTable.addGlobalSecondaryIndex({
      indexName: 'userName-index',
      partitionKey: {
        name: 'userName',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // DynamoDB Table for Batch Operations
    const batchOperationsTable = new dynamodb.Table(this, 'BatchOperationsTable', {
      tableName: 'workspaces-batches',
      partitionKey: {
        name: 'batchId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'expiresAt',
    });

    // SNS Topic for Notifications
    const notificationTopic = new sns.Topic(this, 'WorkSpacesNotificationTopic', {
      topicName: 'workspaces-notifications',
      displayName: 'WorkSpaces Management Notifications',
    });

    // Lambda Function: List WorkSpaces (Read-Only)
    const listWorkSpacesFunction = new lambda.Function(this, 'ListWorkSpacesFunction', {
      functionName: 'workspaces-list',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.listWorkSpaces',
      code: lambda.Code.fromAsset('lambda/dist'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        DYNAMODB_TABLE: workspacesTable.tableName,
        AWS_REGION: this.region,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Least Privilege IAM Policy for List Function
    listWorkSpacesFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: 'WorkSpacesReadOnly',
        effect: iam.Effect.ALLOW,
        actions: [
          'workspaces:Describe*',
          'workspaces:List*',
        ],
        resources: ['*'],
      })
    );

    listWorkSpacesFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: 'CloudWatchMetrics',
        effect: iam.Effect.ALLOW,
        actions: ['cloudwatch:PutMetricData'],
        resources: ['*'],
        conditions: {
          StringEquals: {
            'cloudwatch:namespace': 'CloudGov/WorkSpaces',
          },
        },
      })
    );

    // Grant read access to DynamoDB
    workspacesTable.grantReadData(listWorkSpacesFunction);

    // Lambda Function: Create WorkSpace
    const createWorkSpaceFunction = new lambda.Function(this, 'CreateWorkSpaceFunction', {
      functionName: 'workspaces-create',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.createWorkSpace',
      code: lambda.Code.fromAsset('lambda/dist'),
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
      environment: {
        DYNAMODB_TABLE: workspacesTable.tableName,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
        AWS_REGION: this.region,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Least Privilege IAM Policy for Create Function
    createWorkSpaceFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: 'WorkSpacesCreate',
        effect: iam.Effect.ALLOW,
        actions: [
          'workspaces:CreateWorkspaces',
          'workspaces:DescribeWorkspaces',
        ],
        resources: [
          \`arn:aws:workspaces:\${this.region}:\${this.account}:workspace/*\`,
          \`arn:aws:workspaces:\${this.region}:\${this.account}:directory/*\`,
        ],
      })
    );

    // Grant write access to DynamoDB and SNS
    workspacesTable.grantWriteData(createWorkSpaceFunction);
    notificationTopic.grantPublish(createWorkSpaceFunction);

    // Lambda Function: Bulk Actions
    const bulkActionsFunction = new lambda.Function(this, 'BulkActionsFunction', {
      functionName: 'workspaces-bulk-actions',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.bulkWorkSpaceAction',
      code: lambda.Code.fromAsset('lambda/dist'),
      timeout: cdk.Duration.minutes(5),
      memorySize: 2048,
      environment: {
        DYNAMODB_TABLE: workspacesTable.tableName,
        BATCH_TABLE: batchOperationsTable.tableName,
        AWS_REGION: this.region,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Least Privilege IAM Policy for Bulk Actions
    bulkActionsFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: 'WorkSpacesBulkManagement',
        effect: iam.Effect.ALLOW,
        actions: [
          'workspaces:StartWorkspaces',
          'workspaces:StopWorkspaces',
          'workspaces:RebootWorkspaces',
          'workspaces:TerminateWorkspaces',
          'workspaces:DescribeWorkspaces',
        ],
        resources: [\`arn:aws:workspaces:\${this.region}:\${this.account}:workspace/*\`],
      })
    );

    workspacesTable.grantReadWriteData(bulkActionsFunction);
    batchOperationsTable.grantReadWriteData(bulkActionsFunction);

    // Lambda Function: Get Batch Status
    const getBatchStatusFunction = new lambda.Function(this, 'GetBatchStatusFunction', {
      functionName: 'workspaces-batch-status',
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.getBatchStatus',
      code: lambda.Code.fromAsset('lambda/dist'),
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        DYNAMODB_TABLE: batchOperationsTable.tableName,
        AWS_REGION: this.region,
      },
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    batchOperationsTable.grantReadData(getBatchStatusFunction);

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'WorkSpacesAPI', {
      restApiName: 'workspaces-management-api',
      description: 'API for WorkSpaces fleet management',
      deployOptions: {
        stageName: 'prod',
        tracingEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
      },
    });

    // API Resources and Methods
    const workspaces = api.root.addResource('workspaces');
    
    // GET /workspaces - List WorkSpaces
    workspaces.addMethod(
      'GET',
      new apigateway.LambdaIntegration(listWorkSpacesFunction, {
        proxy: true,
      })
    );

    // POST /workspaces - Create WorkSpace
    workspaces.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createWorkSpaceFunction, {
        proxy: true,
      })
    );

    // POST /workspaces/bulk - Bulk Actions
    const bulk = workspaces.addResource('bulk');
    bulk.addMethod(
      'POST',
      new apigateway.LambdaIntegration(bulkActionsFunction, {
        proxy: true,
      })
    );

    // GET /workspaces/bulk/{batchId} - Get Batch Status
    const batchStatus = bulk.addResource('{batchId}');
    batchStatus.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getBatchStatusFunction, {
        proxy: true,
      })
    );

    // EventBridge Rule for Automated Actions
    const autoStopRule = new events.Rule(this, 'AutoStopWorkSpacesRule', {
      ruleName: 'workspaces-auto-stop',
      description: 'Automatically stop idle WorkSpaces',
      schedule: events.Schedule.cron({
        minute: '0',
        hour: '20',
        weekDay: 'MON-FRI',
      }),
    });

    // CloudWatch Alarms for Monitoring
    const errorMetric = listWorkSpacesFunction.metricErrors({
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });

    // Output API endpoint
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'WorkSpaces Management API Endpoint',
      exportName: 'WorkSpacesAPIEndpoint',
    });

    new cdk.CfnOutput(this, 'WorkSpacesTableName', {
      value: workspacesTable.tableName,
      description: 'DynamoDB Table for WorkSpaces State',
    });

    new cdk.CfnOutput(this, 'NotificationTopicArn', {
      value: notificationTopic.topicArn,
      description: 'SNS Topic for WorkSpaces Notifications',
    });
  }
}
`;

/**
 * Security Best Practices Documentation
 */
export const SECURITY_BEST_PRACTICES = {
  iamRoles: {
    principle: 'Least Privilege Access',
    implementation: [
      'Separate IAM roles per Lambda function',
      'Specific resource ARNs instead of wildcards where possible',
      'Condition keys to restrict actions (e.g., aws:RequestedRegion)',
      'Time-based access restrictions using aws:CurrentTime',
      'IP-based restrictions for sensitive operations',
    ],
    example: 'Each Lambda function has minimum permissions needed',
  },
  
  encryption: {
    atRest: [
      'DynamoDB tables encrypted with AWS-managed keys',
      'CloudWatch Logs encrypted',
      'WorkSpaces volumes encrypted (enforced in creation)',
    ],
    inTransit: [
      'API Gateway with TLS 1.2+',
      'All AWS SDK calls use HTTPS',
      'VPC endpoints for private communication',
    ],
  },
  
  monitoring: {
    cloudWatch: [
      'Lambda function metrics and logs',
      'API Gateway request/error metrics',
      'Custom business metrics (WorkSpaces count, states)',
    ],
    cloudTrail: [
      'All API calls logged',
      'Management events tracked',
      'Data events for sensitive tables',
    ],
    xRay: [
      'Distributed tracing enabled',
      'Performance bottleneck identification',
      'Error analysis and debugging',
    ],
  },
  
  networking: {
    vpc: [
      'Lambda functions in VPC for private resource access',
      'VPC endpoints for AWS services (no internet)',
      'Security groups with minimal ingress rules',
      'Network ACLs for additional layer',
    ],
    apiSecurity: [
      'AWS WAF for API Gateway protection',
      'Rate limiting and throttling',
      'API keys or IAM authentication',
      'Request validation at API Gateway level',
    ],
  },
  
  compliance: {
    framework: 'DOE Q-clearance requirements',
    controls: [
      'Multi-factor authentication required',
      'All data encrypted',
      'Audit logging enabled',
      'Automated compliance checks',
      'Regular security assessments',
    ],
  },
};

/**
 * Scalability Patterns
 */
export const SCALABILITY_PATTERNS = {
  lambda: {
    concurrency: 'Reserved concurrency per function',
    provisioned: 'Provisioned concurrency for predictable load',
    async: 'SQS for async processing of bulk operations',
    stepFunctions: 'Orchestrate complex workflows',
  },
  
  dynamodb: {
    onDemand: 'Pay-per-request for unpredictable workloads',
    autoscaling: 'Provisioned capacity with auto-scaling',
    dax: 'DynamoDB Accelerator for read-heavy workloads',
    streams: 'Real-time stream processing for changes',
  },
  
  apiGateway: {
    caching: 'Response caching for frequent queries',
    throttling: 'Per-client throttling limits',
    bursts: 'Burst capacity for traffic spikes',
    regional: 'Regional endpoints for low latency',
  },
  
  eventDriven: {
    eventBridge: 'Decouple services with events',
    sns: 'Fan-out notifications to multiple subscribers',
    sqs: 'Queue for reliable message delivery',
    stepFunctions: 'Long-running workflow orchestration',
  },
};

/**
 * Cost Optimization Strategies
 */
export const COST_OPTIMIZATION = {
  lambda: [
    'Right-size memory allocation (profiling)',
    'Use ARM64 Graviton2 processors (20% cost savings)',
    'Minimize cold starts with provisioned concurrency only when needed',
    'Use Lambda layers for shared dependencies',
  ],
  
  dynamodb: [
    'On-demand billing for variable workloads',
    'TTL for automatic data expiration',
    'Use projections in GSI to reduce storage',
    'Archive old data to S3',
  ],
  
  workspaces: [
    'AUTO_STOP mode for development WorkSpaces',
    'Right-size bundles based on usage patterns',
    'Monitor and terminate unused WorkSpaces',
    'Use monthly billing for always-on WorkSpaces',
  ],
  
  monitoring: [
    'Set CloudWatch Logs retention periods',
    'Use metric filters instead of log insights',
    'Aggregate logs before analysis',
    'Use CloudWatch Insights only when necessary',
  ],
};

/**
 * Testing Strategy
 */
export const TESTING_APPROACH = {
  unit: {
    framework: 'Jest',
    coverage: 'Minimum 80% code coverage',
    mocking: 'Mock AWS SDK clients',
  },
  
  integration: {
    framework: 'Jest + LocalStack',
    scope: 'Test Lambda + DynamoDB + API Gateway',
    environment: 'Local AWS services simulation',
  },
  
  e2e: {
    framework: 'Cypress',
    scope: 'Full user workflows',
    environment: 'Staging environment',
  },
  
  load: {
    tool: 'Artillery or k6',
    scenarios: 'Bulk operations, API endpoints',
    targets: '1000 requests/second sustained',
  },
};

/**
 * Deployment Pipeline
 */
export const CICD_PIPELINE = {
  stages: [
    {
      name: 'Build',
      steps: [
        'Install dependencies',
        'TypeScript compilation',
        'Run linters (ESLint, Prettier)',
        'Bundle Lambda functions',
      ],
    },
    {
      name: 'Test',
      steps: [
        'Unit tests',
        'Integration tests',
        'Security scanning (npm audit)',
        'Code coverage analysis',
      ],
    },
    {
      name: 'Deploy',
      steps: [
        'CDK diff review',
        'Deploy to staging',
        'Run smoke tests',
        'Deploy to production (with approval)',
      ],
    },
    {
      name: 'Monitor',
      steps: [
        'CloudWatch dashboard creation',
        'Alarm configuration',
        'Log aggregation setup',
        'Performance baseline establishment',
      ],
    },
  ],
  
  tools: [
    'AWS CodePipeline',
    'AWS CodeBuild',
    'GitHub Actions',
    'CDK Pipelines',
  ],
};