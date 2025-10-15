// // lib/aws/workspaces.ts
// import { WorkSpacesClient, DescribeWorkspacesCommand } from "@aws-sdk/client-workspaces";

// /**
//  * WorkSpaces Management
//  * Demonstrates virtual desktop fleet orchestration (LLNL requirement)
//  */
// export async function getWorkSpaces() {
//   const client = new WorkSpacesClient({ region: "us-east-1" });
//   const command = new DescribeWorkspacesCommand({});
//   const response = await client.send(command);
  
//   return response.Workspaces?.map(ws => ({
//     id: ws.WorkspaceId,
//     state: ws.State,
//     userName: ws.UserName,
//     computeType: ws.WorkspaceProperties?.ComputeTypeName,
//     runningMode: ws.WorkspaceProperties?.RunningMode,
//     monthlyCost: calculateWorkSpaceCost(ws)
//   }));
// }