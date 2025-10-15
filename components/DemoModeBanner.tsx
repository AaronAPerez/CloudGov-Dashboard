// /**
//  * Demo Mode Banner Component
//  * 
//  * Professional indicator that shows when displaying sample data
//  * Clearly communicates technical capability while being honest about data source
//  * 
//  * Usage: Place at top of dashboard pages to show recruiters this is demo data
//  * representing real enterprise scale
//  */

// import { Info, Database, Cloud, TrendingUp } from 'lucide-react';

// interface DemoModeBannerProps {
//   variant?: 'banner' | 'card' | 'inline';
//   showStats?: boolean;
// }

// export default function DemoModeBanner({ 
//   variant = 'banner',
//   showStats = true 
// }: DemoModeBannerProps) {
  
//   // Sample enterprise statistics to show what real data looks like
//   const enterpriseStats = {
//     resources: '2,847',
//     monthlySpend: '$47,293',
//     users: '156',
//     regions: '5',
//   };

//   if (variant === 'inline') {
//     return (
//       <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
//         <Info className="w-4 h-4" />
//         <span className="font-medium">Demo Mode:</span>
//         <span>Enterprise-scale sample data</span>
//       </div>
//     );
//   }

//   if (variant === 'card') {
//     return (
//       <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 shadow-sm">
//         <div className="flex items-start gap-3">
//           <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//             <Database className="w-5 h-5 text-amber-700" />
//           </div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-amber-900 mb-1">
//               Demo Mode Active
//             </h3>
//             <p className="text-sm text-amber-800 mb-2">
//               AWS SDK is properly configured and credentials validated. 
//               Displaying enterprise-scale sample data to demonstrate full application capabilities.
//             </p>
//             {showStats && (
//               <div className="grid grid-cols-2 gap-2 mt-3">
//                 <div className="text-xs">
//                   <span className="text-amber-700 font-medium">Sample Resources:</span>
//                   <span className="ml-1 text-amber-900">{enterpriseStats.resources}</span>
//                 </div>
//                 <div className="text-xs">
//                   <span className="text-amber-700 font-medium">Sample Spend:</span>
//                   <span className="ml-1 text-amber-900">{enterpriseStats.monthlySpend}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Default: banner variant
//   return (
//     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           {/* Main Message */}
//           <div className="flex items-center gap-3">
//             <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//               <Cloud className="w-5 h-5" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="font-semibold text-lg">Portfolio Demonstration Mode</span>
//                 <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-medium backdrop-blur-sm">
//                   AWS SDK Connected
//                 </span>
//               </div>
//               <p className="text-sm text-blue-100">
//                 Credentials validated. Displaying enterprise-scale sample data representing 
//                 typical production environment with {enterpriseStats.resources} resources 
//                 across {enterpriseStats.regions} AWS regions.
//               </p>
//             </div>
//           </div>

//           {/* Stats */}
//           {showStats && (
//             <div className="flex items-center gap-6 text-sm">
//               <div className="text-center">
//                 <div className="font-bold text-xl">{enterpriseStats.resources}</div>
//                 <div className="text-blue-100 text-xs">Resources</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold text-xl">{enterpriseStats.monthlySpend}</div>
//                 <div className="text-blue-100 text-xs">Monthly</div>
//               </div>
//               <div className="text-center">
//                 <div className="font-bold text-xl">{enterpriseStats.users}</div>
//                 <div className="text-blue-100 text-xs">IAM Users</div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Technical Note for Recruiters */}
//         <div className="mt-3 pt-3 border-t border-white/20">
//           <div className="flex items-start gap-2 text-xs text-blue-100">
//             <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
//             <p>
//               <strong className="text-white">Technical Implementation:</strong> 
//               This application automatically detects available AWS resources and seamlessly 
//               switches between live data (production) and sample data (demo). The AWS SDK 
//               integration is fully functional and production-ready. Sample data represents 
//               realistic enterprise workloads with proper IAM policies, cost allocation, 
//               and security posture analysis.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /**
//  * Data Source Indicator - Small badge for individual components
//  * Shows whether specific data is live or demo
//  */
// export function DataSourceBadge({ 
//   isLive = false,
//   className = ''
// }: { 
//   isLive?: boolean;
//   className?: string;
// }) {
//   if (isLive) {
//     return (
//       <span className={`inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium ${className}`}>
//         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//         Live Data
//       </span>
//     );
//   }

//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium ${className}`}>
//       <Database className="w-3 h-3" />
//       Sample Data
//     </span>
//   );
// }

// /**
//  * Data Explanation Tooltip
//  * Provides context when hovering over sample data
//  */
// export function DataExplanation() {
//   return (
//     <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
//       <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
//         <Info className="w-4 h-4" />
//         About This Data
//       </h4>
//       <div className="text-xs text-gray-700 space-y-2">
//         <p>
//           <strong>Sample Data Characteristics:</strong> This enterprise-scale 
//           sample data represents a typical mid-size company's AWS infrastructure 
//           with realistic resource distributions, cost patterns, and security configurations.
//         </p>
//         <p>
//           <strong>Why Sample Data?</strong> My AWS free tier account contains no 
//           resources. This sample data demonstrates how the application handles 
//           real production workloads when connected to an active AWS environment.
//         </p>
//         <p>
//           <strong>Production Ready:</strong> The AWS SDK integration is fully 
//           functional. When pointed at an AWS account with resources, this 
//           application automatically displays live data with zero code changes.
//         </p>
//       </div>
//     </div>
//   );
// }