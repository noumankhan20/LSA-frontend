import { useEffect, useState } from 'react';
import {
  FolderOpen,
  Volume2,
  Play,
  Plus
} from 'lucide-react';
import { useRegisterChildMutation, useRegisterSafeguardMutation, useUpdateParentProfileMutation } from '../store/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

interface OtherPagesProps {
  pageId: string;
  childrenList: Array<{
    name: string;
    year: string;
    progress: number;
    lessons: number;
    time: string;
    avatar: string;
    dob?: string;
  }>;
  onAddChild: (child: { name: string; year: string; dob: string; avatar: string }) => void;
  parentDetails: {
    id: string;
    name: string;
    email: string;
    phone: string;
    region: string;
  } | null;
}

export default function OtherPages({ pageId, childrenList, onAddChild, parentDetails }: OtherPagesProps) {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  const [selectedYear, setSelectedYear] = useState('Year 6');
  const [activeTab, setActiveTab] = useState('practice');
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Add child states
  const [showAddModal, setShowAddModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childYear, setChildYear] = useState('Year 6');
  const [childDob, setChildDob] = useState('');
  const [childUsername, setChildUsername] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=80');

  const [registerChild, { isLoading: isRegistering }] = useRegisterChildMutation();

  // Safeguard register states (Regional Admin only)
  const [sgName, setSgName] = useState('');
  const [sgEmail, setSgEmail] = useState('');
  const [sgPhone, setSgPhone] = useState('');
  const [sgPassword, setSgPassword] = useState('');
  const [sgRegion, setSgRegion] = useState('London');
  const [sgCountry, setSgCountry] = useState('United Kingdom');
  const [sgProduct, setSgProduct] = useState('HS');
  const [sgError, setSgError] = useState<string | null>(null);
  const [sgSuccess, setSgSuccess] = useState<string | null>(null);

  const [registerSafeguard, { isLoading: isRegisteringSg }] = useRegisterSafeguardMutation();

  // Parent profile update states
  const [updateParentProfile, { isLoading: isUpdatingProfile }] = useUpdateParentProfileMutation();
  const [profileName, setProfileName] = useState(parentDetails?.name || '');
  const [profilePhone, setProfilePhone] = useState(parentDetails?.phone || '');
  const [profileRegion, setProfileRegion] = useState(parentDetails?.region || '');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (parentDetails) {
      setProfileName(parentDetails.name || '');
      setProfilePhone(parentDetails.phone || '');
      setProfileRegion(parentDetails.region || '');
    }
  }, [parentDetails?.id]);

  // 1. My Children
  if (pageId === 'my-children') {
    return (
      <div className="card-widget">
        <div className="panel-header-row">
          <h3 className="panel-title-text">My Children Profiles</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="action-btn-outline"
            style={{ width: 'auto', padding: '6px 14px', cursor: 'pointer', backgroundColor: 'var(--primary-purple-light)', borderColor: 'var(--primary-purple)', color: 'var(--primary-purple)' }}
          >
            <Plus size={14} /> Add Child
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
          {childrenList.map((child) => (
            <div key={child.name} className="child-row" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '12px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'white' }}>
              <img src={child.avatar} alt={child.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{child.name}</h4>
                <span style={{ fontSize: '0.78rem', color: '#475569' }}>{child.year}</span>
                {child.dob && (
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>DOB: {child.dob}</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div><strong>{child.progress}%</strong><br /><span style={{ color: '#94a3b8' }}>Progress</span></div>
                <div><strong>{child.lessons}</strong><br /><span style={{ color: '#94a3b8' }}>Lessons</span></div>
                <div><strong>{child.time}</strong><br /><span style={{ color: '#94a3b8' }}>Study Time</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Add Child Modal Overlay */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '16px'
          }}>
            <div className="card-widget" style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
              padding: '24px',
              position: 'relative'
            }}>
              <h3 className="panel-title-text" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Register New Student Profile</h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Enter the details of your child to create their learning path on the portal.</p>

              {modalError && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️ {modalError}</span>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setModalError(null);
                if (childName.trim() && childDob && childUsername.trim() && childPassword.trim()) {
                  try {
                    const parentId = (parentDetails as any)?.id || 'parent-id';
                    await registerChild({
                      parentId,
                      name: childName,
                      email: childUsername,
                      password: childPassword,
                      dateOfBirth: childDob,
                      grade: childYear
                    }).unwrap();

                    onAddChild({ name: childName, year: childYear, dob: childDob, avatar: selectedAvatar });
                    setChildName('');
                    setChildDob('');
                    setChildUsername('');
                    setChildPassword('');
                    setShowAddModal(false);
                  } catch (err: any) {
                    setModalError(err?.data?.error || 'Failed to register child. Username might be taken.');
                  }
                }
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Child's Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Johnson"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'border-color 0.15s'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Year Group</label>
                    <select
                      value={childYear}
                      onChange={(e) => setChildYear(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    >
                      {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'].map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Date of Birth</label>
                    <input
                      type="date"
                      value={childDob}
                      onChange={(e) => setChildDob(e.target.value)}
                      style={{
                        padding: '9px 12px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Student Username / Email</label>
                    <input
                      type="text"
                      placeholder="e.g. sarah_login"
                      value={childUsername}
                      onChange={(e) => setChildUsername(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Login Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={childPassword}
                      onChange={(e) => setChildPassword(e.target.value)}
                      style={{
                        padding: '10px 12px',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textAlign: 'left' }}>Select Avatar Profile</label>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '4px 0', justifyContent: 'center' }}>
                    {[
                      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=80',
                      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80'
                    ].map(avatarUrl => (
                      <img
                        key={avatarUrl}
                        src={avatarUrl}
                        alt="Avatar option"
                        onClick={() => setSelectedAvatar(avatarUrl)}
                        style={{
                          width: '48px', height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: selectedAvatar === avatarUrl ? '3px solid var(--primary-purple)' : '2px solid transparent',
                          transform: selectedAvatar === avatarUrl ? 'scale(1.1)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setChildName('');
                      setChildDob('');
                      setChildUsername('');
                      setChildPassword('');
                      setModalError(null);
                      setShowAddModal(false);
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      backgroundColor: 'white',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isRegistering ? '#94a3b8' : 'var(--primary-purple)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'white',
                      cursor: isRegistering ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isRegistering ? 'Registering...' : 'Register Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. My Learning
  if (pageId === 'my-learning') {
    return (
      <div className="home-overview-grid">
        <div className="overview-main-col">
          <div className="card-widget">
            <h3 className="panel-title-text" style={{ marginBottom: '12px' }}>Active Lesson: Year 6 – Autumn Term</h3>

            {/* Mock video player */}
            <div style={{
              width: '100%', height: '240px', backgroundColor: '#022c22', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              color: 'white', position: 'relative', overflow: 'hidden'
            }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Fractions</span>
              <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>Understanding Parts of a Whole</p>
              <div style={{
                position: 'absolute', bottom: '16px', left: '16px', right: '16px',
                display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem'
              }}>
                <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>0:00 / 12:45</span>
                <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                  <div style={{ width: '0%', height: '100%', backgroundColor: 'var(--accent-green)' }}></div>
                </div>
                <Volume2 size={16} />
              </div>
              <button style={{
                width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'white', color: '#022c22',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                <Play size={20} fill="#022c22" />
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                {['Content', 'Notes', 'Resources'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    style={{
                      background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer',
                      fontWeight: 'bold', fontSize: '0.8rem',
                      color: activeTab === tab.toLowerCase() ? '#583fc0' : '#64748b',
                      borderBottom: activeTab === tab.toLowerCase() ? '2px solid #583fc0' : 'none'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'content' && (
                <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  <h4>Introduction to Fractions</h4>
                  <p>A fraction represents a part of a whole or, more generally, any number of equal parts. When spoken in everyday English, a fraction describes how many parts of a certain size there are, for example, one-half, eight-fifths, three-quarters.</p>
                </div>
              )}
              {activeTab === 'notes' && (
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <ul style={{ paddingLeft: '16px' }}>
                    <li>Numerator: The top number, represents how many parts we have.</li>
                    <li>Denominator: The bottom number, represents total parts in a whole.</li>
                    <li>Always simplify fractions to their lowest terms.</li>
                  </ul>
                </div>
              )}
              {activeTab === 'resources' && (
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <a href="#worksheets" style={{ color: 'var(--primary-purple)', textDecoration: 'none' }}>Download Fractions Worksheet (PDF) →</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Index */}
        <div className="curriculum-sidebar-card">
          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '12px' }}>Lesson Modules</h4>
          <div className="curriculum-week-list">
            {[
              { num: '1', title: 'Introduction to Fractions', status: 'done' },
              { num: '2', title: 'Equivalent Fractions', status: 'done' },
              { num: '3', title: 'Improper Fractions & Mixed Numbers', status: 'active' },
              { num: '4', title: 'Adding & Subtracting Fractions', status: 'pending' },
              { num: '5', title: 'Multiplying Fractions', status: 'pending' }
            ].map((mod) => (
              <div key={mod.num} className="curriculum-week-item" style={{
                backgroundColor: mod.status === 'active' ? 'var(--primary-purple-light)' : 'transparent',
                borderColor: mod.status === 'active' ? 'var(--primary-purple)' : '#e2e8f0'
              }}>
                <div className="curriculum-item-left">
                  <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{mod.num}. {mod.title}</span>
                </div>
                <span className={`status-badge ${mod.status === 'done' ? 'done' : mod.status === 'active' ? 'live' : 'upcoming'}`}>
                  {mod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Timetable
  if (pageId === 'timetable') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Timetable & Weekly Planner</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(5, 1fr)', gap: '8px' }}>
          {/* Header Row */}
          <div>Time</div>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => <div key={day} style={{ fontWeight: 'bold', textAlign: 'center' }}>{day}</div>)}

          {/* Time Slot 1 */}
          <div style={{ fontWeight: 'bold' }}>09:00 - 10:00</div>
          {['Maths', 'English', 'Maths', 'Science', 'Maths'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}

          {/* Time Slot 2 */}
          <div style={{ fontWeight: 'bold' }}>10:30 - 11:30</div>
          {['English', 'Science', 'English', 'History', 'English'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}

          {/* Time Slot 3 */}
          <div style={{ fontWeight: 'bold' }}>13:00 - 14:00</div>
          {['History', 'Art', 'Geography', 'Computing', 'PE'].map((s, idx) => (
            <div key={idx} style={{ backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '6px', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '600' }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Subjects
  if (pageId === 'subjects') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text">Subjects Directory</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Explore national curriculum subjects customized for Key Stages.</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              style={{
                padding: '6px 12px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.76rem', fontWeight: '600',
                backgroundColor: selectedYear === yr ? '#583fc0' : 'white',
                color: selectedYear === yr ? 'white' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {yr}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { title: 'Mathematics', desc: 'Fractions, Decimals, Algebra, Geometry' },
            { title: 'English', desc: 'Grammar, Reading comprehension, Spelling' },
            { title: 'Science', desc: 'Chemistry, Physics, Biology forces' },
            { title: 'History', desc: 'Tudors, Romans, Ancient World Wars' },
            { title: 'Geography', desc: 'Climate change, Rivers, Mapping' },
            { title: 'Computing', desc: 'Algorithms, Python coding, HTML Basics' },
            { title: 'Art & Design', desc: 'Drawing, Painting techniques, Modelling' },
            { title: 'PE & Health', desc: 'Stretches, Cardiovascular health' }
          ].map((subj) => (
            <div key={subj.title} className="module-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{subj.title}</h4>
              <p style={{ fontSize: '0.74rem', color: '#64748b' }}>{subj.desc}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--primary-purple)', fontWeight: 'bold', marginTop: 'auto' }}>View Lessons →</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Assignments
  if (pageId === 'assignments') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Homework & Assignments</h3>
        <div className="recent-checkins-list">
          {[
            { title: 'Mathematics Worksheet - Fractions', due: '12 June 2026', subject: 'Maths', status: 'Pending' },
            { title: 'English Reading Comprehension Log', due: '14 June 2026', subject: 'English', status: 'Pending' },
            { title: 'Science Lab Report - Plants', due: '09 June 2026', subject: 'Science', status: 'Completed' },
            { title: 'History Investigation - Ancient Egypt', due: '04 June 2026', subject: 'History', status: 'Completed' }
          ].map((item, idx) => (
            <div key={idx} className="checkin-row-item">
              <div>
                <strong style={{ fontSize: '0.85rem' }}>{item.title}</strong>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Subject: {item.subject} • Due: {item.due}</div>
              </div>
              <span className={`status-badge ${item.status === 'Completed' ? 'done' : 'upcoming'}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Assessments
  if (pageId === 'assessments') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text">Assessments & Quizzes</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>Test learning outcomes based on Key Stage curriculum guidelines.</p>

        <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: 'var(--bg-portal)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>Q1. What fraction of the shape is shaded?</h4>

          {/* Mock visual shape */}
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--primary-purple) 0% 25%, #fff 25% 100%)', border: '2px solid #e2e8f0', margin: '20px auto' }}></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
            {['1/2', '1/3', '1/4', '2/3'].map((ans) => (
              <button
                key={ans}
                onClick={() => setQuizAnswer(ans)}
                style={{
                  padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '600',
                  backgroundColor: quizAnswer === ans ? 'var(--primary-purple)' : 'white',
                  color: quizAnswer === ans ? 'white' : 'var(--text-main)',
                  cursor: 'pointer'
                }}
              >
                Option: {ans}
              </button>
            ))}
          </div>

          {quizAnswer && (
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: quizAnswer === '1/4' ? 'var(--accent-green)' : 'var(--danger-red)', fontWeight: 'bold', textAlign: 'center' }}>
              {quizAnswer === '1/4' ? '✓ Correct Answer!' : '✗ Try again! Hint: 1 piece out of 4 is colored.'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. Progress
  if (pageId === 'progress') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Student Progress Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { subject: 'Mathematics', score: 82, color: 'var(--primary-purple)' },
            { subject: 'English Reading & Writing', score: 74, color: 'var(--accent-green)' },
            { subject: 'Science', score: 78, color: 'var(--info-blue)' },
            { subject: 'History & Civics', score: 68, color: 'var(--warning-orange)' }
          ].map((item) => (
            <div key={item.subject}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '6px' }}>
                <span>{item.subject}</span>
                <span>{item.score}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${item.score}%`, height: '100%', backgroundColor: item.color, borderRadius: '4px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. Reports
  if (pageId === 'reports') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Term Reports & Insights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { term: 'Autumn Term 2025 Report', date: 'Published: Dec 2025', desc: 'Emma has shown exceptional performance in Fractions and Spelling. Science requires regular worksheets check.' },
            { term: 'Summer Term 2025 Report', date: 'Published: Jul 2025', desc: 'Liam completed all KS1 primary transition units with good feedback on physical activity checks.' }
          ].map((item, idx) => (
            <div key={idx} className="contact-directory-row">
              <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{item.term}</span>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0' }}>{item.desc}</p>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Resources
  if (pageId === 'resources') {
    return (
      <div className="card-widget">
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Worksheets & e-Books</h3>
        <div className="docs-download-grid">
          {[
            { title: 'KS2 Maths Worksheet Bundle', size: '2.4 MB' },
            { title: 'Reading Comprehension Logbook', size: '1.8 MB' },
            { title: 'Tudors & Stuarts History Pack', size: '3.1 MB' },
            { title: 'Year 6 Revision Guide (SATS)', size: '4.5 MB' }
          ].map((doc, idx) => (
            <div key={idx} className="doc-download-card">
              <div className="doc-icon-container">
                <FolderOpen size={20} />
              </div>
              <div className="doc-info-block">
                <span className="doc-title-lbl">{doc.title}</span>
                <span className="doc-date-lbl">PDF • {doc.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 10. Messages
  if (pageId === 'messages') {
    return (
      <div className="card-widget" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', minHeight: '300px' }}>
        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>Chats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Tutor - Sarah', 'Safeguarding Lead', 'Parents Community Forum'].map((chat, idx) => (
              <button key={idx} style={{ padding: '8px', borderRadius: '6px', border: 'none', background: idx === 0 ? 'var(--primary-purple-light)' : 'none', color: idx === 0 ? 'var(--primary-purple)' : '#64748b', fontSize: '0.78rem', fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }}>
                {chat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '12px' }}>Tutor - Sarah</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '180px', overflowY: 'auto', paddingRight: '6px', fontSize: '0.8rem' }}>
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '8px', maxWidth: '80%' }}>
              Hello Emma, Emma has performed very well in today's fractions quiz. Let me know if you need specific homework guides.
            </div>
            <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--primary-purple-light)', color: 'var(--primary-purple)', padding: '10px', borderRadius: '8px', maxWidth: '80%' }}>
              Thank you, Sarah. I will print the worksheet bundle.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <input type="text" placeholder="Type a message..." className="form-input" style={{ paddingLeft: '12px' }} />
            <button className="login-btn" style={{ margin: 0, padding: '8px 16px', fontSize: '0.85rem', border: 'none' }}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  // 11. Settings
  if (pageId === 'settings') {
    if (auth.user?.role === 'STUDENT') {
      const studentProfile = auth.user.profile;
      const formattedDob = studentProfile?.dateOfBirth 
        ? new Date(studentProfile.dateOfBirth).toISOString().split('T')[0] 
        : '';

      return (
        <div className="card-widget" style={{ maxWidth: '640px' }}>
          <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Student Profile Details</h3>
          <div className="form-element">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="input-label">Student Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={studentProfile?.name || ''} 
                  style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label className="input-label">Login Email / Username</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={auth.user?.email || ''} 
                  style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} 
                  disabled 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div className="form-group">
                <label className="input-label">Date of Birth</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formattedDob} 
                  style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} 
                  disabled 
                />
              </div>
              <div className="form-group">
                <label className="input-label">Grade / Year Group</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={studentProfile?.grade || ''} 
                  style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }} 
                  disabled 
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    const handleProfileSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileError(null);
      setProfileSuccess(null);

      if (!profileName.trim() || !profileRegion.trim()) {
        setProfileError('Name and Region fields are required.');
        return;
      }

      try {
        const response = await updateParentProfile({
          name: profileName,
          phone: profilePhone,
          region: profileRegion,
        }).unwrap();

        // Update local Redux store user object with fresh profile details
        if (auth.user) {
          dispatch(
            setCredentials({
              user: {
                ...auth.user,
                profile: response.parent,
              },
              token: auth.token || '',
            })
          );
        }
        setProfileSuccess('Profile updated successfully!');
      } catch (err: any) {
        setProfileError(err?.data?.error || 'Failed to update profile. Please try again.');
      }
    };

    return (
      <div className="card-widget" style={{ maxWidth: '640px' }}>
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Account Settings</h3>

        {profileError && (
          <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
            ⚠️ {profileError}
          </div>
        )}

        {profileSuccess && (
          <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
            ✅ {profileSuccess}
          </div>
        )}

        <form className="form-element" onSubmit={handleProfileSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="input-label">Parent Account Name</label>
              <input
                type="text"
                className="form-input"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Contact Email (Read-Only)</label>
              <input
                type="email"
                className="form-input"
                value={parentDetails ? parentDetails.email : ''}
                style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                disabled
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                style={{ paddingLeft: '12px' }}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Region</label>
              <input
                type="text"
                className="form-input"
                value={profileRegion}
                onChange={(e) => setProfileRegion(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{ width: '140px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '24px' }}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  }

  // 12. Register Safeguard (Regional Admin only)
  if (pageId === 'register-safeguard') {
    const handleRegisterSg = async (e: React.FormEvent) => {
      e.preventDefault();
      setSgError(null);
      setSgSuccess(null);

      if (!sgName.trim() || !sgEmail.trim() || !sgPassword.trim() || !sgRegion.trim()) {
        setSgError('Please fill in all required fields.');
        return;
      }

      try {
        await registerSafeguard({
          name: sgName,
          email: sgEmail,
          password: sgPassword,
          phone: sgPhone,
          region: sgRegion,
          country: sgCountry,
          product: sgProduct
        }).unwrap();

        setSgSuccess(`Safeguard officer "${sgName}" successfully registered under region "${sgRegion}".`);
        setSgName('');
        setSgEmail('');
        setSgPhone('');
        setSgPassword('');
      } catch (err: any) {
        setSgError(err?.data?.error || 'Registration failed. The email might be already taken.');
      }
    };

    return (
      <div className="card-widget" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h3 className="panel-title-text" style={{ marginBottom: '8px' }}>Register Regional Safeguard Officer</h3>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
          Create a Designated Safeguarding Lead (DSL) account for your regional educational jurisdiction.
        </p>

        {sgError && (
          <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
            ⚠️ {sgError}
          </div>
        )}

        {sgSuccess && (
          <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
            ✅ {sgSuccess}
          </div>
        )}

        <form className="form-element" onSubmit={handleRegisterSg}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rachel Adams"
                value={sgName}
                onChange={(e) => setSgName(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Email Address (Login)</label>
              <input
                type="email"
                className="form-input"
                placeholder="safeguard@example.com"
                value={sgEmail}
                onChange={(e) => setSgEmail(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="input-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+44 7946 0000"
                value={sgPhone}
                onChange={(e) => setSgPhone(e.target.value)}
                style={{ paddingLeft: '12px' }}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Login Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={sgPassword}
                onChange={(e) => setSgPassword(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <div className="form-group">
              <label className="input-label">Region</label>
              <input
                type="text"
                className="form-input"
                value={sgRegion}
                onChange={(e) => setSgRegion(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Country</label>
              <input
                type="text"
                className="form-input"
                value={sgCountry}
                onChange={(e) => setSgCountry(e.target.value)}
                style={{ paddingLeft: '12px' }}
                required
              />
            </div>
            <div className="form-group">
              <label className="input-label">Product Portal</label>
              <select
                value={sgProduct}
                onChange={(e) => setSgProduct(e.target.value)}
                className="form-input"
                style={{ height: '38px', paddingLeft: '8px' }}
              >
                <option value="HS">Homeschooling (HS)</option>
                <option value="LSA">Tuition Portal (LSA)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isRegisteringSg}
            style={{
              width: '180px',
              fontSize: '0.85rem',
              padding: '10px',
              border: 'none',
              marginTop: '20px',
              backgroundColor: isRegisteringSg ? '#94a3b8' : 'var(--primary-purple)',
              color: 'white',
              cursor: isRegisteringSg ? 'not-allowed' : 'pointer'
            }}
          >
            {isRegisteringSg ? 'Registering...' : 'Register Safeguard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card-widget">
      <h3>Page Not Found</h3>
    </div>
  );
}
