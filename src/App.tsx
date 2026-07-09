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
import TeacherStudentLogin from './pages/auth/TeacherStudentLogin';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import GuardLogin from './pages/auth/GuardLogin';
import ParentRegistration from './pages/auth/ParentRegistration';
export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [parentDetails, setParentDetails] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    relationship: string;
  } | null>(null);

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
  }>>([
    { name: 'Emma', year: 'Year 6', progress: 82, lessons: 5, time: '12h 40m', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', dob: '2014-05-15' },
    { name: 'Liam', year: 'Year 4', progress: 64, lessons: 3, time: '8h 20m', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', dob: '2016-09-20' },
    { name: 'Noah', year: 'Year 2', progress: 76, lessons: 4, time: '10h 15m', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80', dob: '2018-02-10' }
  ]);

  const [selectedChildName, setSelectedChildName] = useState<string>('Emma');

  // Intercept browser navigation for auth routes
  useEffect(() => {
    const handleLocationChange = () => {
      setAuthRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (user: string, _role: string) => {
    setIsAuthenticated(true);
    setLoggedInUser(user);
    setCurrentPage('home');
    // Clear URL to root purely for visual consistency in our mock
    window.history.pushState({}, '', '/');
  };

  const handleRegisterSuccess = (details: { name: string; email: string; phone: string; address: string; relationship: string }) => {
    setParentDetails(details);
    handleLoginSuccess(details.name, 'parent');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoggedInUser('');
    setParentDetails(null);
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
