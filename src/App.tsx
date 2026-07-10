import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';

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

  // Intercept browser navigation for auth routes
  useEffect(() => {
    const handleLocationChange = () => {
      setAuthRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (user: string, role: string, details?: any) => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleRegisterSuccess = (details: { name: string; email: string; phone: string; address: string; relationship: string }) => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    dispatch(logout());
    window.history.pushState({}, '', '/');
    setAuthRoute('/');
  };

  const handlePageChange = (page: string, subpage?: string) => {
    setCurrentPage(page);
    if (subpage) {
      setCurrentSubpage(subpage);
    } else {
      setCurrentSubpage('');
    }
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

          {currentPage === 'safeguarding' && currentSubpage === 'overview' && (
            <SafeguardingOverview onPageChange={handlePageChange} />
          )}

          {currentPage === 'safeguarding' && currentSubpage !== 'overview' && (
            <SafeguardingSubpages subpage={currentSubpage} />
          )}

          {currentPage !== 'home' && currentPage !== 'safeguarding' && (
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
