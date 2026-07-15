import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  userRole: string;
  loggedInUser: string;
  currentPage: string;
  currentSubpage: string;
  selectedChildName: string;
  setSelectedChildName: (name: string) => void;
  childrenList: any[];
  onPageChange: (page: string, subpage?: string) => void;
  onLogout: () => void;
}

export default function DashboardLayout({
  userRole,
  loggedInUser,
  currentPage,
  currentSubpage,
  selectedChildName,
  setSelectedChildName,
  childrenList,
  onPageChange,
  onLogout
}: DashboardLayoutProps) {
  const isAdmin = userRole === 'regional_admin' || userRole === 'regionaladmin' || userRole === 'superadmin';
  const isParent = userRole === 'parent';
  const isStudent = userRole === 'student';
  const isSafeguard = userRole === 'safeguard';

  return (
    <div className={`app-container ${isAdmin ? 'role-admin' : ''} ${isParent ? 'role-parent' : ''} ${isStudent ? 'role-student' : ''} ${isSafeguard ? 'role-safeguard' : ''}`}>
      <Sidebar 
        currentPage={currentPage} 
        currentSubpage={currentSubpage} 
        onPageChange={onPageChange} 
        userRole={userRole}
      />
      <main className="app-main">
        <Header 
          currentPage={currentPage} 
          currentSubpage={currentSubpage} 
          onLogout={onLogout} 
          selectedChildName={selectedChildName}
          setSelectedChildName={setSelectedChildName}
          loggedInUser={loggedInUser}
          childrenList={childrenList}
          userRole={userRole}
          onPageChange={onPageChange}
        />
        <div className="app-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
