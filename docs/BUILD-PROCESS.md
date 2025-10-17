# Build Process Documentation

## Development Workflow
1. Feature branch creation from `main`
2. Local development with hot reload (`npm run dev`)
3. Type checking (`npm run type-check`)
4. Unit tests (`npm test`)
5. E2E tests (`npm run test:e2e`)
6. Code review via pull request
7. CI/CD pipeline execution (Azure DevOps)
8. Deployment to production

## CI/CD Pipeline Stages
### Stage 1: Build
- Install dependencies
- TypeScript compilation
- Bundle optimization
- Asset generation

### Stage 2: Test
- Unit tests (Jest + RTL)
- Integration tests
- E2E tests (Playwright)
- Security scanning (npm audit)
- Lighthouse CI (performance/accessibility)

### Stage 3: Deploy
- Environment variable injection
- AWS credential setup
- Vercel/Amplify deployment
- Health check verification
- Rollback capability

## Commands Reference (Windows PowerShell)
```powershell
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```