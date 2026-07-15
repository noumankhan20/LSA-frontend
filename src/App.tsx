import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import Home from './pages/Home';
import SafeguardingOverview from './pages/SafeguardingOverview';
import SafeguardingSubpages from './pages/SafeguardingSubpages';
import OtherPages from './pages/OtherPages';
import SafeguardDashboard from './pages/SafeguardDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Auth Pages
import LandingPage from './pages/LandingPage';
import ParentStudentLogin from './pages/auth/ParentStudentLogin';
import StudentLogin from './pages/auth/StudentLogin';
import TeacherStudentLogin from './pages/auth/TeacherStudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import GuardLogin from './pages/auth/GuardLogin';
import ParentRegistration from './pages/auth/ParentRegistration';

import { useSelector, useDispatch } from 'react-redux';
import { useGetMeQuery, useLogoutMutation } from './store/apiSlice';
import { logout, setCredentials } from './store/slices/authSlice';

// Parameterized page wrapper components for react-router params
function SafeguardingSubpagesWrapper() {
  const { subpage } = useParams<{ subpage: string }>();
  return <SafeguardingSubpages subpage={subpage || 'overview'} />;
}

interface OtherPagesWrapperProps {
  childrenList: any[];
  onAddChild: (child: any) => void;
  parentDetails: any;
}

function OtherPagesWrapper({ childrenList, onAddChild, parentDetails }: OtherPagesWrapperProps) {
  const { pageId } = useParams<{ pageId: string }>();
  return (
    <OtherPages 
      pageId={pageId || 'home'} 
      childrenList={childrenList}
      onAddChild={onAddChild}
      parentDetails={parentDetails}
    />
  );
}

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();
  
  // Authentication State from Redux
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  // Derived values
  const loggedInUser = user?.profile?.name || user?.email || '';
  const userRole = user?.role ? user.role.toLowerCase() : '';
  const parentDetails = useMemo(() => {
    return user?.role === 'PARENT' ? { ...user?.profile, email: user?.email } : null;
  }, [user]);

  // Helper to resolve page and subpage from window pathname
  const getPageFromPath = (path: string, role: string) => {
    const cleanedPath = path.replace(/^\//, '');
    if (!cleanedPath) {
      if (role === 'safeguard') return { page: 'welfare-logs', subpage: '' };
      if (role === 'parent') return { page: 'home', subpage: '' };
      if (role === 'student') return { page: 'home', subpage: '' };
      if (role === 'regional_admin' || role === 'regionaladmin' || role === 'superadmin') return { page: 'home', subpage: '' };
      return { page: 'home', subpage: '' };
    }

    if (cleanedPath === 'safeguard-dashboard') return { page: 'welfare-logs', subpage: '' };
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
    if (page === 'raised-tickets' || page === 'welfare-logs' || page === 'queries') {
      return '/safeguard-dashboard';
    }
    if (page === 'safeguarding') {
      if (subpage && subpage !== 'overview') return `/safeguarding/${subpage}`;
      return '/safeguarding';
    }
    return `/${page}`;
  };

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
  const { data: userData, error: userError } = useGetMeQuery(undefined);

  useEffect(() => {
    if (userData?.user) {
      dispatch(setCredentials({ user: userData.user }));
    } else if (userError) {
      const status = 'status' in userError ? userError.status : null;
      if (status === 401) {
        dispatch(logout());
        logoutApi();
      }
    }
  }, [userData, userError, dispatch, logoutApi]);

  // Synchronize state with route location
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const { page, subpage } = getPageFromPath(location.pathname, userRole);
      setCurrentPage(page);
      setCurrentSubpage(subpage);
    }
  }, [location.pathname, isAuthenticated, userRole]);

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
    } else if (userRole === 'student' && selectedChildName !== loggedInUser) {
      setSelectedChildName(loggedInUser);
    }
  }, [userRole, parentDetails, loggedInUser, selectedChildName]);

  // Authentication Handlers
  const handleLoginSuccess = (_user: string, role: string, details?: any) => {
    const resolvedRole = role === 'guard' ? 'safeguard' : (details?.role ? details.role.toLowerCase() : role);
    const { page, subpage } = getPageFromPath('/', resolvedRole);
    const newPath = getPathFromPage(page, subpage, resolvedRole);
    navigate(newPath, { replace: true });
  };

  const handleRegisterSuccess = (_details: { name: string; email: string; phone: string; region: string }) => {
    const { page, subpage } = getPageFromPath('/', 'parent');
    const newPath = getPathFromPage(page, subpage, 'parent');
    navigate(newPath, { replace: true });
  };

  const handleLogout = () => {
    logoutApi();
    dispatch(logout());
    navigate('/', { replace: true });
  };

  const handlePageChange = (page: string, subpage?: string) => {
    const resolvedSubpage = subpage || '';
    const newPath = getPathFromPage(page, resolvedSubpage, userRole);
    navigate(newPath);
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

  const renderHome = () => (
    <Home 
      childrenList={children}
      selectedChildName={selectedChildName}
      setSelectedChildName={setSelectedChildName}
      onPageChange={handlePageChange}
      userRole={userRole}
      parentDetails={parentDetails}
      onAddChild={handleAddChild}
    />
  );

  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={getPathFromPage('home', '', userRole)} replace />
        ) : (
          <LandingPage onNavigate={(path) => navigate(path)} />
        )
      } />
      
      <Route path="/login-hs" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <ParentStudentLogin onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/login-student" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <StudentLogin onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/login-tutn" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <TeacherStudentLogin onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/login-sa" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/login-guard" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <GuardLogin onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/register-hs" element={
        isAuthenticated ? <Navigate to={getPathFromPage('home', '', userRole)} replace /> : <ParentRegistration onRegisterSuccess={handleRegisterSuccess} />
      } />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={
          <DashboardLayout
            userRole={userRole}
            loggedInUser={loggedInUser}
            currentPage={currentPage}
            currentSubpage={currentSubpage}
            selectedChildName={selectedChildName}
            setSelectedChildName={setSelectedChildName}
            childrenList={children}
            onPageChange={handlePageChange}
            onLogout={handleLogout}
          />
        }>
          {/* Main home dashboards */}
          <Route path="/parent-dashboard" element={renderHome()} />
          <Route path="/student-dashboard" element={renderHome()} />
          <Route path="/admin-dashboard" element={renderHome()} />

          {/* Safeguard dashboards */}
          <Route path="/safeguard-dashboard" element={<SafeguardDashboard />} />

          {/* Safeguarding resources overview */}
          <Route path="/safeguarding" element={<SafeguardingOverview onPageChange={handlePageChange} />} />
          <Route path="/safeguarding/:subpage" element={<SafeguardingSubpagesWrapper />} />

          {/* Other/fallback pages */}
          <Route path="/:pageId" element={
            <OtherPagesWrapper 
              childrenList={children} 
              onAddChild={handleAddChild} 
              parentDetails={parentDetails} 
            />
          } />
        </Route>
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
