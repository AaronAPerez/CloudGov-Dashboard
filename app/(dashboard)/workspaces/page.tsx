// Copy the WorkSpaces Manager component code here
import React from "react";
import WorkSpacesPage from "@/components/WorkSpacesPage";




// Add metadata
export const metadata = {
  title: 'WorkSpaces | CloudGov Dashboard',
  description: 'Manage your AWS WorkSpaces fleet',
};

export default function Page() {
  return <WorkSpacesPage />;
}