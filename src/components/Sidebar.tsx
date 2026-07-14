import { useState } from 'react';
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  Book,
  FileText,
  Award,
  TrendingUp,
  BarChart2,
  FolderOpen,
  MessageSquare,
  ShieldCheck,
  Settings,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  currentSubpage: string;
  onPageChange: (page: string, subpage?: string) => void;
  userRole?: string;
}

export default function Sidebar({ currentPage, currentSubpage, onPageChange, userRole }: SidebarProps) {
  const [safeguardingOpen, setSafeguardingOpen] = useState(currentPage === 'safeguarding');

  const handleSafeguardingClick = () => {
    setSafeguardingOpen(!safeguardingOpen);
    onPageChange('safeguarding', 'overview');
  };

  const navItems = userRole === 'safeguard' ? [
    { id: 'welfare-logs', label: 'Tickets & Queries', icon: FileText },
  ] : [
    { id: 'home', label: 'Home', icon: Home },
    ...(userRole === 'parent' ? [
      { id: 'my-children', label: 'My Children', icon: Users },
    ] : userRole === 'student' || !userRole ? [
      { id: 'my-learning', label: 'My Learning', icon: BookOpen },
    ] : []),
    ...(userRole === 'regional_admin' || userRole === 'regionaladmin' || userRole === 'superadmin' ? [
      { id: 'regional-parents', label: 'Parents', icon: Users },
      { id: 'register-safeguard', label: 'Safeguard Officer', icon: ShieldCheck },
    ] : []),
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Section */}
      <div className="brand-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain' }} />
        <div className="brand-title-group">
          <span className="brand-name">LSA</span>
          <span className="brand-sub">AI-Powered<br /> Curriculum Portal</span>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id} className="menu-item-wrapper">
              <button
                onClick={() => onPageChange(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}

        {/* Settings */}
        <li className="menu-item-wrapper">
          <button
            onClick={() => onPageChange('settings')}
            className={`sidebar-link ${currentPage === 'settings' ? 'active' : ''}`}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </li>
      </ul>

      {/* Emergency Helpline Card */}
      <div className="sidebar-help-card">
        <div className="help-card-icon">
          <HelpCircle size={18} />
        </div>
        <div className="help-card-title">Need Help?</div>
        <div className="help-card-text">Safeguarding Helpline</div>
        <a href="tel:02079460958" className="help-card-number">020 7946 0958</a>
        <div className="help-card-extra">Out of hours: 999</div>
      </div>
    </aside>
  );
}
