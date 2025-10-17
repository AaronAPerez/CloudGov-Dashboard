📚 API Documentation
AWS Connection Status
Check Connection Status

GET /api/aws/connection-status

Response:
json{
  "success": true,
  "services": [
    {
      "name": "Amazon EC2",
      "connected": true,
      "hasData": false,
      "latency": 203,
      "resourceCount": 0
    }
  ],
  "summary": {
    "totalServices": 5,
    "connectedServices": 5,
    "servicesWithData": 0,
    "averageLatency": 209,
    "totalResources": 0
  },
  "mode": "demo",
  "timestamp": "2025-10-15T10:30:00Z"
}
IAM Endpoints
Get IAM Roles
httpGET /api/iam/roles?riskLevel=high&limit=20
Query Parameters:

riskLevel (optional): low, medium, high, critical
limit (optional): Number of results (default: 50)
offset (optional): Pagination offset

Response:
json{
  "roles": [
    {
      "arn": "arn:aws:iam::123456789012:role/AdminRole",
      "name": "AdminRole",
      "riskScore": 85,
      "isOverlyPermissive": true,
      "hasMFA": false,
      "policies": [...],
      "lastUsed": "2025-10-12T10:30:00Z",
      "recommendations": [
        "Enable MFA requirement",
        "Reduce admin permissions",
        "Add permissions boundary"
      ]
    }
  ],
  "summary": {
    "totalRoles": 24,
    "highRiskRoles": 3,
    "averageRiskScore": 42.5
  }
}
Get IAM Users
httpGET /api/iam/users?accessLevel=admin
Get Security Recommendations
httpGET /api/iam/recommendations
Resource Endpoints
Get Resources
httpGET /api/resources?type=EC2&status=running&region=us-east-1
Query Parameters:

type (optional): EC2, S3, Lambda, RDS, DynamoDB
status (optional): running, stopped, terminated
region (optional): AWS region
owner (optional): Resource owner tag
limit (optional): Results per page
offset (optional): Pagination offset

Cost Endpoints
Get Cost Data
httpGET /api/costs?range=30d&groupBy=SERVICE
Query Parameters:

range: 7d, 30d, 90d, custom
groupBy: SERVICE, REGION, TAG
startDate (optional): ISO 8601 date
endDate (optional): ISO 8601 date

WorkSpaces Endpoints
Get WorkSpaces
httpGET /api/workspaces?status=AVAILABLE