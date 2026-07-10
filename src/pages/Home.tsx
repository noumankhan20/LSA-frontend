import { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  Plus, 
  GraduationCap, 
  Sparkles, 
  ClipboardList, 
  FileSpreadsheet, 
  BookOpen, 
  BookCheck, 
  HelpCircle as QuizIcon, 
  FileText, 
  Lightbulb, 
  Dumbbell,
  User,
  Calendar,
  Layers,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';
import { useRegisterChildMutation } from '../store/apiSlice';

interface HomeProps {
  childrenList: Array<{
    name: string;
    year: string;
    progress: number;
    lessons: number;
    time: string;
    avatar: string;
    dob?: string;
  }>;
  selectedChildName: string;
  setSelectedChildName: (name: string) => void;
  onPageChange: (page: string, subpage?: string) => void;
  userRole?: string;
  parentDetails?: any;
  onAddChild?: (child: { name: string; year: string; dob: string; avatar: string }) => void;
}

export default function Home({ 
  childrenList, 
  selectedChildName, 
  setSelectedChildName, 
  onPageChange,
  userRole,
  parentDetails,
  onAddChild
}: HomeProps) {
  const [activeStep, setActiveStep] = useState(3); // Default step 3
  const [activeWeek, setActiveWeek] = useState(12);

  // Parent Add Child form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [childName, setChildName] = useState('');
  const [childYear, setChildYear] = useState('Year 6');
  const [childDob, setChildDob] = useState('');
  const [childUsername, setChildUsername] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [registerChild, { isLoading: isRegistering }] = useRegisterChildMutation();

  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!childName.trim() || !childDob || !childUsername.trim() || !childPassword.trim()) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const parentId = parentDetails?.id || 'parent-id';
      await registerChild({
        parentId,
        name: childName,
        email: childUsername,
        password: childPassword,
        dateOfBirth: childDob,
        grade: childYear
      }).unwrap();

      const defaultAvatars = [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=80'
      ];
      const nextAvatar = defaultAvatars[childrenList.length % defaultAvatars.length];

      if (onAddChild) {
        onAddChild({
          name: childName,
          year: childYear,
          dob: childDob,
          avatar: nextAvatar
        });
      }

      setChildName('');
      setChildDob('');
      setChildUsername('');
      setChildPassword('');
      setShowAddForm(false);
    } catch (err: any) {
      setFormError(err?.data?.error || 'Failed to add student profile. Username/email might be taken.');
    }
  };

  if (userRole === 'parent') {
    return (
      <div style={{ padding: '10px 0', fontFamily: 'system-ui, sans-serif' }}>
        {/* Welcome Section */}
        <div className="card-widget" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #583fc0 0%, #311c87 100%)', color: 'white', padding: '30px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', color: 'white' }}>
            Welcome back, {parentDetails?.name || 'Parent'}!
          </h2>
          <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '600px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.85)' }}>
            Monitor and manage your children's learning pathways, track weekly progress, and update configurations from your dashboard.
          </p>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: showAddForm ? '1.1fr 0.9fr' : '1fr', gap: '24px', alignItems: 'start', transition: 'all 0.3s ease' }}>
          
          {/* Children List Column */}
          <div className="card-widget" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 className="panel-title-text" style={{ fontSize: '1.2rem', fontWeight: '700' }}>Your Registered Children</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  {childrenList.length === 0 ? 'No children profiles registered yet.' : `Currently managing ${childrenList.length} student profile${childrenList.length > 1 ? 's' : ''}`}
                </p>
              </div>
              {!showAddForm && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="action-btn-outline" 
                  style={{ width: 'auto', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#583fc0', borderColor: '#583fc0', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', fontWeight: '600' }}
                >
                  <Plus size={16} /> Add Child
                </button>
              )}
            </div>

            {childrenList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <UserPlus size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#1e293b' }}>No Children Added</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '300px' }}>
                  Register a profile for your child to start assigning subject courses and tracking their learning progress.
                </p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#583fc0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Register First Child
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {childrenList.map((child) => (
                  <div 
                    key={child.name} 
                    className="child-card"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      padding: '24px', 
                      gap: '16px', 
                      textAlign: 'center', 
                      border: '1.5px solid #f1f5f9', 
                      borderRadius: '12px', 
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#583fc0' }} />
                    <img 
                      src={child.avatar} 
                      alt={child.name} 
                      style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f1f5f9' }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{child.name}</h4>
                      <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500', display: 'inline-block', marginTop: '4px', backgroundColor: '#f1f5f9', padding: '3px 10px', borderRadius: '12px' }}>
                        {child.year}
                      </span>
                      {child.dob && (
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px' }}>Date of Birth: {child.dob}</div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: '0.78rem', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '4px' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{child.progress}%</strong>
                        <br />
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Progress</span>
                      </div>
                      <div style={{ borderLeft: '1px solid #f1f5f9', height: '24px' }} />
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{child.lessons}</strong>
                        <br />
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Lessons</span>
                      </div>
                      <div style={{ borderLeft: '1px solid #f1f5f9', height: '24px' }} />
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{child.time}</strong>
                        <br />
                        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Study Time</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Elegant Add Child Inline Card Form */}
          {showAddForm && (
            <div className="card-widget" style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                <h3 className="panel-title-text" style={{ fontSize: '1.15rem', fontWeight: '700' }}>Register New Student</h3>
                <button 
                  onClick={() => { setShowAddForm(false); setFormError(null); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </div>

              {formError && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid #fecaca', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️ {formError}</span>
                </div>
              )}

              <form onSubmit={handleAddChildSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Child's Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Liam"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Year Group</label>
                    <div style={{ position: 'relative' }}>
                      <Layers size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <select 
                        value={childYear}
                        onChange={(e) => setChildYear(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', backgroundColor: 'white' }}
                      >
                        {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'].map(yr => (
                          <option key={yr} value={yr}>{yr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Date of Birth</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="date" 
                        value={childDob}
                        onChange={(e) => setChildDob(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Child Username / Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. liam_smith"
                      value={childUsername}
                      onChange={(e) => setChildUsername(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Child Login Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={childPassword}
                      onChange={(e) => setChildPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isRegistering}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#583fc0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isRegistering ? 'Registering...' : 'Register Student'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    );
  }

  const selectedChildObj = childrenList.find(c => c.name === selectedChildName) || childrenList[0];
  const progressVal = selectedChildObj ? selectedChildObj.progress : 75;
  const lessonsCount = selectedChildObj ? selectedChildObj.lessons : 5;
  const completedCount = selectedChildObj ? Math.ceil((lessonsCount * progressVal) / 100) : 3;
  const timeSpentVal = selectedChildObj ? selectedChildObj.time : '2h 15m';

  const steps = [
    { num: 1, label: 'Add Child', desc: 'Create profile' },
    { num: 2, label: 'Select Year', desc: 'Reception to Year 11' },
    { num: 3, label: 'Select Subjects', desc: 'Choose curriculum' },
    { num: 4, label: 'Learning Mode', desc: 'Full/Part-time' },
    { num: 5, label: 'Start Learning', desc: 'Begin 39-week journey' }
  ];

  const lessons = [
    { time: '09:00', subject: 'Maths - Fractions', status: completedCount >= 1 ? 'done' : 'upcoming' },
    { time: '10:00', subject: 'English - Reading Skills', status: completedCount >= 2 ? 'done' : 'upcoming' },
    { time: '11:00', subject: 'Science - Plants', status: completedCount >= 3 ? 'done' : 'live' },
    { time: '13:00', subject: 'History - Ancient Egypt', status: 'upcoming' },
    { time: '14:30', subject: 'PE - Indoor Fitness', status: 'upcoming' }
  ];

  const weekTasks = [
    { title: 'Lesson Plan', desc: 'Understand objectives & plan', icon: BookOpen },
    { title: 'Lesson', desc: 'Video, slides & explanation', icon: Play },
    { title: 'Practice', desc: 'Questions & activities', icon: BookCheck },
    { title: 'Homework', desc: 'Tasks & assignments', icon: FileSpreadsheet },
    { title: 'Quiz', desc: 'Quick check', icon: QuizIcon },
    { title: 'Weekly Test', desc: 'Assess your learning', icon: ClipboardList },
    { title: 'PE Activity', desc: 'Stay active & healthy', icon: Dumbbell }
  ];

  return (
    <div>
      {/* 1. GET STARTED STEPPER */}
      <section className="get-started-box">
        <div className="stepper-header">
          <span>1. GET STARTED – CHOOSE YOUR CHILD'S LEARNING PATH</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Step {activeStep} of 5</span>
        </div>
        <div className="stepper-steps">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => {
                setActiveStep(s.num);
                if (s.num === 1) {
                  onPageChange('my-children');
                }
              }}
              className={`stepper-step ${activeStep === s.num ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'white', cursor: 'pointer' }}
            >
              <div className="step-circle">{s.num}</div>
              <div className="step-details">
                <span className="step-num">{s.desc}</span>
                <span className="step-label">{s.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. PARENT DASHBOARD MAIN GRID */}
      <div className="home-overview-grid">
        <div className="overview-main-col">
          {/* Dashboard Summary Numbers */}
          <div className="overview-summary-strip">
            <div className="summary-strip-card">
              <span className="strip-card-value">{lessonsCount}</span>
              <span className="strip-card-label">Today's Lessons</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">{completedCount}</span>
              <span className="strip-card-label">Completed</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">{progressVal}%</span>
              <span className="strip-card-label">Practice Score</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">{timeSpentVal}</span>
              <span className="strip-card-label">Time Spent</span>
            </div>
            <div className="summary-strip-card">
              <span className="strip-card-value">{lessonsCount - completedCount}</span>
              <span className="strip-card-label">Upcoming Lessons</span>
            </div>
          </div>

          {/* Children & Schedules cards split */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
            {/* Children Overview Card */}
            <div className="card-widget">
              <div className="panel-header-row">
                <h3 className="panel-title-text">Children Overview</h3>
                <button 
                  onClick={() => onPageChange('my-children')}
                  className="panel-view-all" 
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--primary-purple)', fontWeight: 'bold' }}
                >
                  <Plus size={14} /> Add Child
                </button>
              </div>

              <div className="recent-checkins-list" style={{ marginTop: '12px' }}>
                {childrenList.map((child) => (
                  <div 
                    key={child.name} 
                    className={`child-row ${selectedChildName === child.name ? 'selected-child-active' : ''}`}
                    onClick={() => setSelectedChildName(child.name)}
                    style={{ cursor: 'pointer', padding: '10px', borderRadius: '8px', border: selectedChildName === child.name ? '1.5px solid var(--primary-purple)' : '1px solid transparent', transition: 'all 0.2s', backgroundColor: selectedChildName === child.name ? 'var(--primary-purple-light)' : 'transparent' }}
                  >
                    <div className="child-avatar-info">
                      <img src={child.avatar} alt={child.name} className="child-avatar" />
                      <div className="child-name-yr">
                        <span className="child-name" style={{ fontWeight: selectedChildName === child.name ? '700' : '650' }}>{child.name}</span>
                        <span className="child-yr">{child.year}</span>
                      </div>
                    </div>
                    <div className="child-percentage-badge" style={{ backgroundColor: selectedChildName === child.name ? 'var(--primary-purple)' : '#f1f5f9', color: selectedChildName === child.name ? 'white' : 'var(--text-main)' }}>{child.progress}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="card-widget">
              <div className="panel-header-row">
                <h3 className="panel-title-text">Today's Schedule</h3>
                <span className="panel-view-all" style={{ cursor: 'pointer' }} onClick={() => onPageChange('timetable')}>Full Timetable →</span>
              </div>
              <div className="today-schedule-list" style={{ marginTop: '12px' }}>
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="schedule-row">
                    <span className="schedule-time">{lesson.time}</span>
                    <span className="schedule-subj">{lesson.subject}</span>
                    <span className={`status-badge ${lesson.status}`}>{lesson.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Overview Trend Chart */}
          <div className="card-widget">
            <div className="panel-header-row">
              <h3 className="panel-title-text">Progress Overview</h3>
              <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            
            {/* Mock Chart Area */}
            <div className="chart-container-mock">
              {[60, 45, 80, 55, 70, 90, 85].map((val, idx) => (
                <div key={idx} className="chart-bar-mock" style={{ height: `${val}%` }}>
                  <div className="chart-bar-fill" style={{ height: '100%' }}></div>
                  <span className="chart-bar-label">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '28px', fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#583fc0' }}></span> Maths: 82%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> English: 74%
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span> Science: 78%
              </span>
            </div>
          </div>
        </div>

        {/* 39-WEEK CURRICULUM JOURNEY SIDEBAR */}
        <div className="curriculum-sidebar-card">
          <div className="panel-header-row" style={{ marginBottom: '8px' }}>
            <h3 className="panel-title-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} style={{ color: '#03684a' }} />
              39-Week Curriculum Journey
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#475569' }}>Year 6 - Autumn Term - Week {activeWeek}</p>

          <div className="week-navigation-tabs">
            {[10, 11, 12, 13, 14].map((wk) => (
              <button
                key={wk}
                className={`week-tab ${activeWeek === wk ? 'active' : ''}`}
                onClick={() => setActiveWeek(wk)}
              >
                Wk {wk}
              </button>
            ))}
          </div>

          <div className="curriculum-week-list">
            {weekTasks.map((t, index) => {
              const Icon = t.icon;
              return (
                <div key={index} className="curriculum-week-item">
                  <div className="curriculum-item-left">
                    <div className="curr-item-icon-wrapper">
                      <Icon size={18} />
                    </div>
                    <div className="curr-item-text">
                      <span className="curr-item-title">{t.title}</span>
                      <span className="curr-item-desc">{t.desc}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              );
            })}
          </div>
          
          <button className="action-btn-outline" style={{ marginTop: '16px', borderColor: '#03684a', color: '#03684a', backgroundColor: '#ecfdf5' }}>
            View Full 39-Week Scheme →
          </button>
        </div>
      </div>

      {/* 3. BOTTOM KNOWLEDGE & UTILITY MODULES */}
      <h3 className="panel-title-text" style={{ marginTop: '32px', marginBottom: '16px' }}>Interactive Supporting Modules</h3>
      <div className="bottom-modules-grid">
        {/* Module 4 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#583fc0' }}>
            <BookOpen size={18} />
          </div>
          <span className="module-card-title">4. Learning Modules</span>
          <div className="module-step-flow">
            {['Learn & watch', 'Practice questions', 'Assess skills', 'Review reports', 'Master concepts'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">{i+1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 5 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#3b82f6' }}>
            <Sparkles size={18} />
          </div>
          <span className="module-card-title">5. AI Learning Support</span>
          <div className="module-step-flow">
            {['Ask AI Tutor', 'Generate Study Notes', 'Custom Practice', 'Identify Learning Gaps'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">★</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 6 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#f59e0b' }}>
            <FileText size={18} />
          </div>
          <span className="module-card-title">6. Parent Tools & Reports</span>
          <div className="module-step-flow">
            {['Detailed Progress', 'Attendance tracker', 'Evidence Portfolio', 'Weekly Summaries'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module 7 */}
        <div className="module-card">
          <div className="module-icon-container" style={{ backgroundColor: '#10b981' }}>
            <Lightbulb size={18} />
          </div>
          <span className="module-card-title">7. Resources Hub</span>
          <div className="module-step-flow">
            {['Printable Worksheets', 'Curriculum Videos', 'Digital E-Books', 'SATs Revision Packs'].map((step, i) => (
              <div key={i} className="module-step-item">
                <span className="module-step-bullet">📂</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
