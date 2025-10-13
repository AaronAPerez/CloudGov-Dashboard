# CloudGov Dashboard

[![Build Status]](https://dev.azure.com/cloudgov/dashboard/_build/latest?definitionId=1&branchName=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> **Portfolio Project**: Advanced cloud governance dashboard demonstrating full-stack development, cloud security, and DevOps proficiency.

## 🚧 Status: In Development

This is an active portfolio project showcasing enterprise-grade cloud governance capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Security](#security)
- [License](#license)

## 🎯 Overview

CloudGov Dashboard is a comprehensive cloud governance platform that demonstrates:

- **Cloud Security**: IAM role management with risk scoring and least-privilege analysis
- **Cost Optimization**: Multi-service cost tracking, trend analysis, and recommendations
- **Resource Management**: Real-time monitoring of AWS resources with advanced filtering
- **Serverless Architecture**: Event-driven functions for automated security scanning
- **Full-Stack Development**: Modern Next.js frontend with .NET backend
- **DevOps Best Practices**: CI/CD pipelines, automated testing, and security scanning

## ✨ Features

### IAM Security Management
- **Role Risk Analysis**: 0-100 risk scoring system for IAM roles
- **Least-Privilege Recommendations**: Automated policy optimization suggestions
- **MFA Compliance Tracking**: Monitor multi-factor authentication adoption
- **Access Level Auditing**: Track admin, power-user, and read-only access
- **Permissions Boundary Monitoring**: Ensure roles operate within defined limits

### Cost Analytics
- **Multi-Service Tracking**: Monitor costs across EC2, S3, Lambda, RDS, and more
- **Trend Analysis**: Daily, weekly, and monthly cost patterns
- **Anomaly Detection**: Automatic alerts for unusual spending patterns
- **Cost Optimization**: Identify savings opportunities (AUTO_STOP, right-sizing)
- **Custom Date Ranges**: Flexible reporting periods

### Resource Management
- **Real-Time AWS Integration**: Live data from AWS SDK (EC2, S3, Lambda, RDS, DynamoDB)
- **Advanced Filtering**: Filter by type, status, region, owner
- **Bulk Operations**: Start, stop, tag, or terminate multiple resources
- **Multiple Views**: Table and grid layouts for different workflows
- **CSV Export**: Export filtered data for external analysis
- **DynamoDB Caching**: Fallback cache when AWS SDK unavailable

### WorkSpaces Orchestration
- **State Management**: Track AVAILABLE, STOPPED, ERROR states
- **Running Mode Analysis**: AUTO_STOP vs ALWAYS_ON optimization
- **Cost Recommendations**: Identify inactive WorkSpaces for savings
- **Usage Tracking**: Monitor last connection timestamps

### AI Usage Tracking
- **Multi-Provider Support**: OpenAI, AWS Bedrock, Anthropic, Google AI
- **Token Usage Logging**: Track consumption across all providers
- **Cost Attribution**: Per-request cost tracking
- **Performance Metrics**: Response time and success rate analytics
- **User Analytics**: Usage patterns by user and provider

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 3.4.1
- **Data Fetching**: SWR 2.3.0
- **Icons**: Lucide React 0.468.0
- **Charts**: Recharts 2.15.0

### Backend
- **Framework**: .NET 8.0 (C#)
- **Architecture**: Clean Architecture with DI
- **APIs**: RESTful with ASP.NET Core
- **Cloud SDKs**: AWS SDK for JavaScript v3
- **Logging**: Microsoft.Extensions.Logging

### AWS SDK Integration
- **@aws-sdk/client-ec2**: EC2 instance management
- **@aws-sdk/client-s3**: S3 bucket operations
- **@aws-sdk/client-lambda**: Lambda function monitoring
- **@aws-sdk/client-rds**: RDS database tracking
- **@aws-sdk/client-dynamodb**: DynamoDB table operations

### Serverless Functions

#### AWS Lambda
- **IAM Role Analyzer**: Daily security risk assessment
- **Cost Calculator**: Real-time cost analysis and anomaly detection
- **Security Scanner**: S3 and EC2 vulnerability scanning

#### Azure Functions
- **IAM Role Analyzer**: Azure AD role analysis
- **Cost Calculator**: Azure Cost Management integration

### DevOps
- **CI/CD**: Azure DevOps Pipelines
- **Build**: Multi-stage (Build → Test → Deploy)
- **Security**: NPM audit, NuGet vulnerability scanning
- **Testing**: Automated test execution
- **Deployment**: Docker-ready, cloud-native

## 🏗 Architecture

```
cloudgov-dashboard/
├── app/                          # Next.js pages (App Router)
│   ├── page.tsx                  # Dashboard homepage
│   ├── iam/                      # IAM security pages
│   ├── resources/                # Resource management
│   ├── costs/                    # Cost analytics
│   ├── settings/                 # Application settings
│   └── api/                      # Next.js API routes
│       ├── iam/
│       │   ├── roles/route.ts
│       │   └── users/route.ts
│       ├── ai-usage/route.ts
│       ├── workspaces/route.ts
│       ├── resources/route.ts    # AWS resources API
│       └── costs/route.ts
├── lib/                          # Core utilities
│   ├── aws/                      # AWS integration
│   │   ├── config.ts             # AWS configuration
│   │   ├── services.ts           # AWS SDK clients
│   │   └── dynamodb.ts           # DynamoDB operations
│   ├── types.ts                  # TypeScript types
│   ├── utils.ts                  # Helper functions
│   └── hooks/                    # Custom React hooks
├── components/                   # React components
│   ├── ui/                       # UI components (Button, Badge, Card)
│   │   └── layout/               # Layout components (Sidebar, Header)
│   ├── dashboard/                # Dashboard widgets
│   ├── bulk_actions_api.tsx      # Bulk operations
│   └── resource_details_modal.tsx
├── backend-dotnet/               # .NET backend
│   ├── Controllers/              # API controllers
│   │   ├── IAMController.cs
│   │   └── ResourcesController.cs
│   ├── Services/                 # Business logic
│   │   ├── IIAMService.cs
│   │   ├── IAMService.cs
│   │   └── IAWSService.cs
│   ├── Models/                   # Data models
│   │   └── IAMRole.cs
│   └── Program.cs                # App entry point
├── lambda-functions/             # AWS Lambda functions
│   ├── iam-role-analyzer/
│   ├── cost-calculator/
│   └── security-scanner/
├── azure-functions/              # Azure Functions
│   ├── IAMRoleAnalyzer/
│   └── CostCalculator/
├── public/                       # Static assets
│   └── site.webmanifest          # PWA manifest
├── azure-pipelines.yml           # CI/CD configuration
└── aws-setup-permissions.md      # AWS IAM setup guide
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- .NET 8.0 SDK
- AWS CLI (optional, for Lambda deployment)
- Azure Functions Core Tools (optional, for Azure Functions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cloudgov-dashboard.git
   cd cloudgov-dashboard
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend-dotnet
   dotnet restore
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your AWS credentials
   ```

   **Required Environment Variables:**
   ```env
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key_here
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here

   # DynamoDB Table Names
   DYNAMODB_RESOURCES_TABLE=CloudGovResources
   DYNAMODB_COSTS_TABLE=CloudGovCosts
   DYNAMODB_IAM_TABLE=CloudGovIAM
   DYNAMODB_WORKSPACES_TABLE=CloudGovWorkSpaces
   DYNAMODB_AI_USAGE_TABLE=CloudGovAIUsage

   # Feature Flags
   USE_REAL_AWS=true
   ENABLE_MOCK_DATA=false

   # Application Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3002
   ```

5. **Configure AWS IAM Permissions**

   Your AWS IAM user needs the following permissions:
   - `ec2:DescribeInstances`
   - `s3:ListAllMyBuckets`
   - `lambda:ListFunctions`
   - `rds:DescribeDBInstances`
   - `dynamodb:ListTables`
   - `workspaces:DescribeWorkspaces`

   See [aws-setup-permissions.md](aws-setup-permissions.md) for detailed setup instructions.

### Running Locally

**Frontend (Next.js)**
```bash
npm run dev
# Visit http://localhost:3002
```

**Backend (.NET)**
```bash
cd backend-dotnet
dotnet run
# API available at http://localhost:5000
```

**Lambda Functions (Local)**
```bash
cd lambda-functions/iam-role-analyzer
npm install
sam local start-api
```

**Azure Functions (Local)**
```bash
cd azure-functions
npm install
func start
```

## 📚 API Documentation

### IAM Endpoints

#### Get IAM Roles
```http
GET /api/iam/roles?riskLevel=high
```

**Response:**
```json
{
  "roles": [
    {
      "arn": "arn:aws:iam::123456789012:role/AdminRole",
      "name": "AdminRole",
      "riskScore": 85,
      "isOverlyPermissive": true,
      "policies": [...],
      "lastUsed": "2025-10-12T10:30:00Z"
    }
  ],
  "summary": {
    "totalRoles": 24,
    "highRiskRoles": 3,
    "averageRiskScore": 42.5
  }
}
```

#### Get IAM Users
```http
GET /api/iam/users?accessLevel=admin
```

#### Get Security Recommendations
```http
GET /api/iam/recommendations
```

### Resource Endpoints

#### Get Resources
```http
GET /api/resources?type=EC2&status=running&region=us-east-1
```

#### Get WorkSpaces
```http
GET /api/workspaces?status=AVAILABLE
```

### Cost Endpoints

#### Get Costs
```http
GET /api/costs?range=30d&groupBy=SERVICE
```

### AI Usage Endpoints

#### Get AI Usage Logs
```http
GET /api/ai-usage?provider=OpenAI
```

## 🚀 Deployment

### Azure DevOps Pipeline

The project includes a complete CI/CD pipeline (`azure-pipelines.yml`):

**Stages:**
1. **Build**: Compile frontend and backend
2. **Test**: Run unit tests and security scans
3. **Deploy**: Deploy to production (requires environment setup)

**Triggers:**
- Automatic on push to `main`, `master`, or `develop`
- Manual deployment available

### Lambda Deployment

```bash
cd lambda-functions/iam-role-analyzer
npm install
zip -r function.zip .
aws lambda update-function-code \
  --function-name iam-role-analyzer \
  --zip-file fileb://function.zip
```

### Azure Functions Deployment

```bash
cd azure-functions
func azure functionapp publish cloudgov-functions
```

## 💻 Development

### Build Commands

```bash
# Frontend
npm run build          # Production build
npm run dev            # Development server
npm run lint           # ESLint
npm run type-check     # TypeScript checking

# Backend
dotnet build           # Build .NET project
dotnet test            # Run tests
dotnet publish         # Publish for deployment
```

### Code Structure

**Frontend Components**
- `app/page.tsx`: Main dashboard with metrics cards
- `app/iam/page.tsx`: IAM security dashboard
- `app/resources/page.tsx`: Resource management interface
- `app/settings/page.tsx`: Application configuration
- `components/ui/`: Reusable UI components

**AWS Integration Layer**
- `lib/aws/config.ts`: Centralized AWS configuration with environment variables
- `lib/aws/services.ts`: Real AWS SDK clients (EC2, S3, Lambda, RDS, DynamoDB)
- `lib/aws/dynamodb.ts`: DynamoDB CRUD operations for caching
- `app/api/resources/route.ts`: Resources API with AWS SDK → DynamoDB fallback

**Backend Services**
- `IAMService.cs`: IAM role and user management
- `AWSService.cs`: AWS resource and WorkSpaces management
- Controllers: RESTful API endpoints

**Serverless Functions**
- Event-driven security and cost analysis
- Automated alerting and notifications
- DynamoDB integration for data persistence

## 🔒 Security

### Best Practices Implemented

- **Least-Privilege Access**: All IAM roles follow principle of least privilege
- **MFA Enforcement**: Multi-factor authentication required for admin access
- **Security Scanning**: Automated vulnerability detection
- **Encryption**: All data encrypted at rest and in transit
- **Audit Logging**: Comprehensive activity tracking
- **CORS Configuration**: Restricted cross-origin requests

### Security Features

- IAM risk scoring (0-100 scale)
- Overly permissive policy detection
- Inactive user identification
- Public S3 bucket detection
- Open security group detection
- IMDSv2 enforcement checking

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🎓 Portfolio Project

This project demonstrates:

✅ **Full-Stack Development**: Next.js + .NET integration
✅ **Cloud Architecture**: AWS Lambda + Azure Functions
✅ **Security Focus**: IAM analysis and vulnerability scanning
✅ **Cost Optimization**: Multi-cloud cost management
✅ **DevOps Practices**: CI/CD with Azure DevOps
✅ **Modern Frontend**: React, TypeScript, Tailwind CSS
✅ **Backend Proficiency**: C# .NET 8.0 with Clean Architecture
✅ **Serverless Computing**: Event-driven microservices

---

## 🚀 Quick Start Summary

1. Install dependencies: `npm install`
2. Configure `.env.local` with AWS credentials
3. Set up AWS IAM permissions (see [aws-setup-permissions.md](aws-setup-permissions.md))
4. Run development server: `npm run dev`
5. Visit: `http://localhost:3002`

## 📊 Key Metrics

- **Components**: 50+ reusable React components
- **API Endpoints**: 15+ RESTful APIs
- **AWS Services**: 5 integrated services (EC2, S3, Lambda, RDS, DynamoDB)
- **Serverless Functions**: 3 Lambda + 2 Azure Functions
- **Lines of Code**: ~10,000+ (TypeScript, C#, Python)

## 🎯 Project Goals

This portfolio project demonstrates:

✅ **Full-Stack Development**: Next.js frontend + .NET backend
✅ **Cloud Architecture**: Multi-cloud serverless computing
✅ **Security Focus**: IAM analysis, risk scoring, vulnerability scanning
✅ **Cost Optimization**: Multi-service cost tracking and recommendations
✅ **DevOps Practices**: CI/CD pipelines with Azure DevOps
✅ **Modern Frontend**: React 18, TypeScript, Tailwind CSS
✅ **Backend Proficiency**: C# .NET 8.0 with Clean Architecture
✅ **Real AWS Integration**: Live data from AWS SDK v3 (no mock data)

---

**Built with ❤️ as a portfolio demonstration**
