# AWS IAM Permissions Setup

## Problem
Your IAM user `cloudgov-admin` is missing permissions to access AWS resources.

## Current Errors
- ❌ `dynamodb:ListTables` - Cannot list DynamoDB tables
- ❌ `lambda:ListFunctions` - Cannot list Lambda functions
- ❌ `s3:ListAllMyBuckets` - Cannot list S3 buckets
- ❌ `ec2:DescribeInstances` - Cannot list EC2 instances
- ❌ `rds:DescribeDBInstances` - Cannot list RDS instances

---

## Solution 1: Quick Fix (Attach AWS Managed Policy)

### Step 1: Using AWS Console

1. Go to **IAM Console**: https://console.aws.amazon.com/iam/
2. Click **Users** → **cloudgov-admin**
3. Click **Add permissions** → **Attach policies directly**
4. Search for and attach: **`ViewOnlyAccess`** or **`ReadOnlyAccess`**
5. Click **Add permissions**

### Step 2: Using AWS CLI

```bash
# Attach ViewOnlyAccess policy (recommended for read-only dashboard)
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::aws:policy/job-function/ViewOnlyAccess

# OR attach ReadOnlyAccess (alternative)
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
```

---

## Solution 2: Custom Policy (Least Privilege - Recommended for Production)

Create a custom IAM policy with only the permissions needed:

### Step 1: Create the Policy File

Save this as `cloudgov-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2ReadAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeVolumes",
        "ec2:DescribeSnapshots",
        "ec2:DescribeImages",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeVpcs",
        "ec2:DescribeSubnets",
        "ec2:DescribeRegions",
        "ec2:DescribeAvailabilityZones"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3ReadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "s3:GetBucketTagging",
        "s3:GetBucketVersioning",
        "s3:GetBucketPolicy",
        "s3:GetBucketAcl",
        "s3:ListBucket"
      ],
      "Resource": "*"
    },
    {
      "Sid": "LambdaReadAccess",
      "Effect": "Allow",
      "Action": [
        "lambda:ListFunctions",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration",
        "lambda:ListTags"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DynamoDBReadAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:ListTables",
        "dynamodb:DescribeTable",
        "dynamodb:ListTagsOfResource",
        "dynamodb:DescribeTimeToLive",
        "dynamodb:DescribeContinuousBackups"
      ],
      "Resource": "*"
    },
    {
      "Sid": "RDSReadAccess",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:DescribeDBClusters",
        "rds:DescribeDBSnapshots",
        "rds:ListTagsForResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudWatchReadAccess",
      "Effect": "Allow",
      "Action": [
        "cloudwatch:GetMetricStatistics",
        "cloudwatch:ListMetrics",
        "cloudwatch:DescribeAlarms"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CostExplorerReadAccess",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMReadAccess",
      "Effect": "Allow",
      "Action": [
        "iam:GetUser",
        "iam:ListUsers",
        "iam:ListRoles",
        "iam:GetRole",
        "iam:ListPolicies",
        "iam:GetPolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

### Step 2: Create and Attach the Policy

```bash
# Create the policy
aws iam create-policy \
  --policy-name CloudGovDashboardReadOnly \
  --policy-document file://cloudgov-policy.json \
  --description "Read-only access for CloudGov Dashboard"

# Attach to your user (replace ACCOUNT_ID with your AWS account ID)
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::914964735718:policy/CloudGovDashboardReadOnly
```

---

## Solution 3: For DynamoDB-Only Access

If you only want the app to read from DynamoDB (not query AWS resources):

```bash
# Attach DynamoDB read-only access
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess
```

Then update your `.env.local`:
```
USE_REAL_AWS=false
```

This will make the app use DynamoDB cache instead of querying AWS resources directly.

---

## Verify Permissions

After applying permissions, test with AWS CLI:

```bash
# Test EC2 access
aws ec2 describe-instances --region us-east-1 --max-results 5

# Test S3 access
aws s3 ls

# Test Lambda access
aws lambda list-functions --region us-east-1 --max-items 5

# Test DynamoDB access
aws dynamodb list-tables --region us-east-1

# Test RDS access
aws rds describe-db-instances --region us-east-1
```

---

## Troubleshooting

### Error: "User is not authorized to perform..."

**Cause**: Missing IAM permissions

**Fix**: Follow Solution 1 (Quick Fix) or Solution 2 (Custom Policy) above

### Error: "No identity-based policy allows..."

**Cause**: The policy isn't attached to your user

**Fix**:
```bash
# List policies attached to your user
aws iam list-attached-user-policies --user-name cloudgov-admin

# If empty, attach a policy (see solutions above)
```

### Error: "Access Denied"

**Cause**: Insufficient permissions or policy conditions blocking access

**Fix**: Use Solution 1 (ViewOnlyAccess) which has broader permissions

---

## Security Best Practices

1. **Least Privilege**: Use Solution 2 (custom policy) for production
2. **Separate Users**: Create a dedicated read-only user for the dashboard
3. **Rotate Credentials**: Regularly rotate AWS access keys
4. **Use IAM Roles**: Consider using IAM roles with EC2/ECS instead of access keys
5. **Enable MFA**: Add Multi-Factor Authentication to your IAM user
6. **Monitor Usage**: Use CloudTrail to monitor API calls

---

## Quick Command Summary

```bash
# ✅ Recommended: Attach ViewOnlyAccess
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::aws:policy/job-function/ViewOnlyAccess

# ✅ Alternative: Attach ReadOnlyAccess
aws iam attach-user-policy \
  --user-name cloudgov-admin \
  --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess

# ✅ Verify
aws iam list-attached-user-policies --user-name cloudgov-admin

# ✅ Test
aws ec2 describe-instances --region us-east-1 --max-results 1
```

---

## After Fixing Permissions

1. Restart your Next.js dev server: `npm run dev`
2. Refresh the dashboard at http://localhost:3002
3. Check the Resources page - you should now see your real AWS resources!

No more permission errors! 🎉
