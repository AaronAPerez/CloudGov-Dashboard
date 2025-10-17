🏗 Architecture
System Architecture

┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Frontend                       │
│         (TypeScript + React + Tailwind CSS)                 │
│  • Server-side Rendering (SSR)                              │
│  • Static Site Generation (SSG)                             │
│  • Client-side Data Fetching (SWR)                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              API Routes (Next.js Server)                     │
│  • /api/aws/connection-status - Connection validation       │
│  • /api/resources - Resource management                     │
│  • /api/costs - Cost analytics                              │
│  • /api/iam - IAM security analysis                         │
│  • /api/workspaces - WorkSpaces management                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS SDK v3 Layer                          │
│  • Real-time AWS service integration                        │
│  • Credential management                                     │
│  • Error handling and retry logic                           │
│  • Response caching and optimization                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│   Live Data     │   │   Demo Mode     │
│  (When AWS      │   │  (Sample Data   │
│  resources      │   │   when no       │
│  exist)         │   │   resources)    │
│                 │   │                 │
│ • Real metrics  │   │ • Enterprise    │
│ • Live costs    │   │   scale         │
│ • Actual IAM    │   │ • Realistic     │
│                 │   │   patterns      │
└─────────────────┘   └─────────────────┘