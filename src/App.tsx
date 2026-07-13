import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';
import SafeguardDashboard from './pages/SafeguardDashboard';

// Auth Pages
import LandingPage from './pages/LandingPage';
import ParentStudentLogin from './pages/auth/ParentStudentLogin';
import StudentLogin from './pages/auth/StudentLogin';
import TeacherStudentLogin from './pages/auth/TeacherStudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import GuardLogin from './pages/auth/GuardLogin';
import ParentRegistration from './pages/auth/ParentRegistration';

import { useSelector, useDispatch } from 'react-redux';
import { useGetMeQuery } from './store/apiSlice';
import { logout, setCredentials } from './store/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  
  // Authentication State from Redux
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  // Derived values
  const loggedInUser = user?.profile?.name || user?.email || '';
  const userRole = user?.role ? user.role.toLowerCase() : '';
  const parentDetails = user?.role === 'PARENT' ? { ...user?.profile, email: user?.email } : null;

  // Helper to resolve page and subpage from window pathname
  const getPageFromPath = (path: string, role: string) => {
    const cleanedPath = path.replace(/^\//, '');
    if (!cleanedPath) {
      if (role === 'safeguard') return { page: 'raised-tickets', subpage: '' };
      if (role === 'parent') return { page: 'home', subpage: '' };
      if (role === 'student') return { page: 'home', subpage: '' };
      if (role === 'regional_admin' || role === 'regionaladmin' || role === 'superadmin') return { page: 'home', subpage: '' };
      return { page: 'home', subpage: '' };
    }

    if (cleanedPath === 'safeguard-dashboard') return { page: 'raised-tickets', subpage: '' };
    if (cleanedPath === 'parent-dashboard' || cleanedPath === 'student-dashboard' || cleanedPath === 'admin-dashboard') return { page: 'home', subpage: '' };
    
    if (cleanedPath.startsWith('safeguarding/')) {
      return { page: 'safeguarding', subpage: cleanedPath.split('/')[1] };
    }
    if (cleanedPath === 'safeguarding') {
      return { page: 'safeguarding', subpage: 'overview' };
    }

    return { page: cleanedPath, subpage: '' };
  };

  // Helper to map page and subpage back to URL pathname
  const getPathFromPage = (page: string, subpage: string, role: string) => {
    if (page === 'home') {
      if (role === 'parent') return '/parent-dashboard';
      if (role === 'student') return '/student-dashboard';
      if (role === 'regional_admin' || role === 'regionaladmin' || role === 'superadmin') return '/admin-dashboard';
      return '/';
    }
    if (page === 'raised-tickets') {
      return '/safeguard-dashboard';
    }
    if (page === 'safeguarding') {
      if (subpage && subpage !== 'overview') return `/safeguarding/${subpage}`;
      return '/safeguarding';
    }
    return `/${page}`;
  };

  // Simple state-based routing for Auth URLs
  const [authRoute, setAuthRoute] = useState<string>(window.location.pathname);

  // Navigation Routing States (Post-Login)
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentSubpage, setCurrentSubpage] = useState<string>('overview');

  // Children State
  const [children, setChildren] = useState<Array<{
    name: string;
    year: string;
    progress: number;
    lessons: number;
    time: string;
    avatar: string;
    dob?: string;
  }>>([]);

  const [selectedChildName, setSelectedChildName] = useState<string>('');

  // Validate session on load
  const { data: userData, error: userError } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (userData?.user) {
      dispatch(setCredentials({ user: userData.user, token: localStorage.getItem('token') || '' }));
    } else if (userError) {
      dispatch(logout());
    }
  }, [userData, userError, dispatch]);

  // Synchronize state and URL on mount or when userRole changes
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const { page, subpage } = getPageFromPath(window.location.pathname, userRole);
      setCurrentPage(page);
      setCurrentSubpage(subpage);

      // Replace URL if it doesn't match the standard path mapping
      const standardPath = getPathFromPage(page, subpage, userRole);
      if (window.location.pathname !== standardPath) {
        window.history.replaceState({}, '', standardPath);
      }
    }
  }, [isAuthenticated, userRole]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleLocationChange = () => {
      setAuthRoute(window.location.pathname);
      if (isAuthenticated && userRole) {
        const { page, subpage } = getPageFromPath(window.location.pathname, userRole);
        setCurrentPage(page);
        setCurrentSubpage(subpage);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [isAuthenticated, userRole]);

  // Synchronize Children when parentDetails / userRole changes
  useEffect(() => {
    if (userRole === 'parent' && parentDetails) {
      if (parentDetails.students && Array.isArray(parentDetails.students)) {
        const loadedChildren = parentDetails.students.map((s: any, idx: number) => {
          const defaultAvatars = [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=80'
          ];
          return {
            name: s.name,
            year: s.grade || 'Year 6',
            progress: 82 - (idx * 15), // Mock some initial data based on index
            lessons: 5 - idx,
            time: `${12 - idx}h ${40 - idx * 10}m`,
            avatar: defaultAvatars[idx % defaultAvatars.length],
            dob: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : ''
          };
        });
        setChildren(loadedChildren);
        if (loadedChildren.length > 0 && !selectedChildName) {
          setSelectedChildName(loadedChildren[0].name);
        }
      } else {
        setChildren([]);
      }
    } else if (userRole === 'student') {
      setSelectedChildName(loggedInUser);
    }
  }, [userRole, parentDetails, loggedInUser, selectedChildName]);

  // Authentication Handlers
  const handleLoginSuccess = (_user: string, role: string, details?: any) => {
    const resolvedRole = role === 'guard' ? 'safeguard' : (details?.role ? details.role.toLowerCase() : role);
    const { page, subpage } = getPageFromPath('/', resolvedRole);
    setCurrentPage(page);
    setCurrentSubpage(subpage);
    const newPath = getPathFromPage(page, subpage, resolvedRole);
    window.history.pushState({}, '', newPath);
  };

  const handleRegisterSuccess = (_details: { name: string; email: string; phone: string; region: string }) => {
    const { page, subpage } = getPageFromPath('/', 'parent');
    setCurrentPage(page);
    setCurrentSubpage(subpage);
    const newPath = getPathFromPage(page, subpage, 'parent');
    window.history.pushState({}, '', newPath);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.history.pushState({}, '', '/');
    setAuthRoute('/');
  };

  const handlePageChange = (page: string, subpage?: string) => {
    setCurrentPage(page);
    const resolvedSubpage = subpage || '';
    setCurrentSubpage(resolvedSubpage);
    const newPath = getPathFromPage(page, resolvedSubpage, userRole);
    window.history.pushState({}, '', newPath);
  };

  const handleAddChild = (newChild: { name: string; year: string; dob: string; avatar: string }) => {
    const childObj = {
      name: newChild.name,
      year: newChild.year,
      progress: 0,
      lessons: 0,
      time: '0h 0m',
      avatar: newChild.avatar,
      dob: newChild.dob
    };
    setChildren(prev => [...prev, childObj]);
    setSelectedChildName(newChild.name);
  };

  if (!isAuthenticated) {
    if (authRoute === '/login-hs') {
      return <ParentStudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-student') {
      return <StudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-tutn') {
      return <TeacherStudentLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-sa') {
      return <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/login-guard') {
      return <GuardLogin onLoginSuccess={handleLoginSuccess} />;
    }
    if (authRoute === '/register-hs') {
      return <ParentRegistration onRegisterSuccess={handleRegisterSuccess} />;
    }
    // Default fallback is the new Landing Page
    return <LandingPage onNavigate={setAuthRoute} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentPage={currentPage} 
        currentSubpage={currentSubpage} 
        onPageChange={handlePageChange} 
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="app-main">
        <Header 
          currentPage={currentPage} 
          currentSubpage={currentSubpage} 
          onLogout={handleLogout} 
          selectedChildName={selectedChildName}
          setSelectedChildName={setSelectedChildName}
          loggedInUser={loggedInUser}
          childrenList={children}
          userRole={userRole}
        />

        <div className="app-body">
          {currentPage === 'home' && (
            <Home 
              childrenList={children}
              selectedChildName={selectedChildName}
              setSelectedChildName={setSelectedChildName}
              onPageChange={handlePageChange}
              userRole={userRole}
              parentDetails={parentDetails}
              onAddChild={handleAddChild}
            />
          )}

          {(currentPage === 'raised-tickets' || currentPage === 'queries') && (
            <SafeguardDashboard type={currentPage as 'raised-tickets' | 'queries'} />
          )}

          {currentPage === 'safeguarding' && currentSubpage === 'overview' && (
            <SafeguardingOverview onPageChange={handlePageChange} />
          )}

          {currentPage === 'safeguarding' && currentSubpage !== 'overview' && (
            <SafeguardingSubpages subpage={currentSubpage} />
          )}

          {currentPage !== 'home' && currentPage !== 'safeguarding' && currentPage !== 'raised-tickets' && currentPage !== 'queries' && (
            <OtherPages 
              pageId={currentPage} 
              childrenList={children}
              onAddChild={handleAddChild}
              parentDetails={parentDetails}
            />
          )}
        </div>
      </main>
    </div>
  );
}
