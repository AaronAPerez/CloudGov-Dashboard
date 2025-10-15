# Component Integration Guide

## Quick Start

1. **Configure AWS Credentials**
   ```bash
   npm run setup:aws
   # Or manually edit .env.local
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access New Pages**
   - WorkSpaces: http://localhost:3000/workspaces
   - Settings: http://localhost:3000/settings
   - Security: http://localhost:3000/security

## Manual Steps Required

### 1. Copy Component Files

Copy the following component code into these files:

- `src/app/(dashboard)/workspaces/page.tsx` - WorkSpaces Manager UI
- `src/app/(dashboard)/settings/page.tsx` - Settings Page UI
- `src/app/api/workspaces/route.ts` - API routes for WorkSpaces
- `src/app/api/workspaces/bulk/route.ts` - Bulk operations API

### 2. Update Navigation

Add to your navigation component:

```typescript
const navigation = [
  // ... existing items
  { name: 'WorkSpaces', href: '/workspaces', icon: Monitor },
  { name: 'Settings', href: '/settings', icon: Settings },
];
```

### 3. Configure AWS

Update `.env.local` with your AWS credentials:
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

### 4. Deploy Lambda Functions (Optional)

If using serverless backend:

```bash
cd lambda
npm install
cdk bootstrap
cdk deploy WorkSpacesManagementStack
```

## Testing

```bash
# Test API endpoint
npm run test:api

# Type check
npm run type-check

# Run development server
npm run dev
```

## Troubleshooting

### Issue: AWS SDK Errors

**Solution:**
```bash
aws configure
# Or set environment variables in .env.local
```

### Issue: Module Not Found

**Solution:**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Issue: TypeScript Errors

**Solution:**
```bash
npm run type-check
# Fix any reported issues
```

## Next Steps

1. ✅ Review generated files
2. ✅ Copy component UI code
3. ✅ Update navigation links
4. ✅ Configure AWS credentials
5. ✅ Test locally
6. ✅ Deploy to production

For detailed instructions, see the main Integration Guide.
