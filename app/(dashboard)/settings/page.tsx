// Copy the WorkSpaces Manager component code here
import WorkSpacesPage from '@/components/workspaces/WorkSpacesPage';

export default function Page() {
  return <WorkSpacesPage />;
}

// Add metadata
export const metadata = {
  title: 'WorkSpaces | CloudGov Dashboard',
  description: 'Manage your AWS WorkSpaces fleet',
};