import React, { useEffect, useState } from 'react';
import {
  FolderOpen,
  Volume2,
  Play,
  Plus,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  ChevronDown,
  ChevronRight,
  Pencil
} from 'lucide-react';
import { useRegisterChildMutation, useRegisterSafeguardMutation, useUpdateParentProfileMutation, useUpdateSafeguardProfileMutation, useUpdateProfileMutation, useChangePasswordMutation, useGetSafeguardsQuery, useGetRegionalParentsQuery } from '../store/apiSlice';
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
  const [showSgModal, setShowSgModal] = useState(false);

  // Regional Admin states (unconditional top-level hooks)
  const [updateProfile, { isLoading: isUpdatingAdmin }] = useUpdateProfileMutation();
  const adminProfile = auth.user?.profile || {};
  const [adminName, setAdminName] = useState(adminProfile.name || '');
  const [adminPhone, setAdminPhone] = useState(adminProfile.phone || '');
  const [adminRegion] = useState(adminProfile.region || '');
  const [adminUpdateSuccess, setAdminUpdateSuccess] = useState<string | null>(null);
  const [adminUpdateError, setAdminUpdateError] = useState<string | null>(null);

  // Change Password states (shared across roles)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<any>(null);
  const [expandedParentId, setExpandedParentId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Unconditional hook call for regional parents list
  const { data: parentsData, isLoading: isParentsLoading } = useGetRegionalParentsQuery(undefined, {
    skip: auth.user?.role !== 'REGIONAL_ADMIN'
  });

  // Unconditional hook call for regional safeguards list
  const { data: sgData, isLoading: isSgListLoading, refetch: refetchSgList } = useGetSafeguardsQuery(undefined, {
    skip: auth.user?.role !== 'REGIONAL_ADMIN'
  });

  useEffect(() => {
    if (auth.user?.profile) {
      setAdminName(auth.user.profile.name || '');
      setAdminPhone(auth.user.profile.phone || '');
    }
  }, [auth.user]);

  // Safeguard profile update states (unconditional)
  const [updateSafeguardProfile, { isLoading: isUpdatingSg }] = useUpdateSafeguardProfileMutation();
  const [sgProfileName, setSgProfileName] = useState('');
  const [sgProfilePhone, setSgProfilePhone] = useState('');
  const [sgProfileRegion, setSgProfileRegion] = useState('');
  const [sgProfileCountry, setSgProfileCountry] = useState('');
  const [sgUpdateError, setSgUpdateError] = useState<string | null>(null);
  const [sgUpdateSuccess, setSgUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user?.role === 'SAFEGUARD' && auth.user.profile) {
      setSgProfileName(auth.user.profile.name || '');
      setSgProfilePhone(auth.user.profile.phone || '');
      setSgProfileRegion(auth.user.profile.region || '');
      setSgProfileCountry(auth.user.profile.country || '');
    }
  }, [auth.user]);

  // Student profile update states (unconditional)
  const [updateStudentProfile, { isLoading: isUpdatingStudent }] = useUpdateProfileMutation();
  const [studentNameState, setStudentNameState] = useState('');
  const [studentDobState, setStudentDobState] = useState('');
  const [studentUpdateSuccess, setStudentUpdateSuccess] = useState<string | null>(null);
  const [studentUpdateError, setStudentUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user?.role === 'STUDENT' && auth.user.profile) {
      setStudentNameState(auth.user.profile.name || '');
      const dob = auth.user.profile.dateOfBirth
        ? new Date(auth.user.profile.dateOfBirth).toISOString().split('T')[0]
        : '';
      setStudentDobState(dob);
    }
  }, [auth.user]);

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

  useEffect(() => {
    if (auth.user?.role === 'REGIONAL_ADMIN' && auth.user.profile?.region) {
      setSgRegion(auth.user.profile.region);
    }
  }, [auth.user]);

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
    const handleChangePasswordSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError(null);
      setPasswordSuccess(null);

      if (!oldPassword || !newPassword || !confirmNewPassword) {
        setPasswordError('All fields are required.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setPasswordError('New passwords do not match.');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters.');
        return;
      }

      try {
        await changePassword({ oldPassword, newPassword }).unwrap();
        setPasswordSuccess('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (err: any) {
        setPasswordError(err?.data?.error || 'Failed to change password. Please try again.');
      }
    };

    const renderPasswordForm = () => (
      <div className="card-widget" style={{ maxWidth: '800px', marginTop: '32px' }}>
        <h3 className="panel-title-text" style={{ marginBottom: '16px' }}>Change Password</h3>

        {passwordError && (
          <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
            ❌ {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
            ✅ {passwordSuccess}
          </div>
        )}

        <form className="form-element" onSubmit={handleChangePasswordSubmit} style={{ maxWidth: '800px', marginTop: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="input-label" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-end', minHeight: '34px', marginBottom: '6px', fontSize: '0.85rem' }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  className="form-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  style={{ 
                    paddingLeft: '12px', 
                    paddingRight: '40px', 
                    width: '100%', 
                    height: '42px', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-light)', 
                    backgroundColor: '#ffffff',
                    fontSize: '0.88rem', 
                    outline: 'none',
                    color: 'var(--text-main)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="input-label" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-end', minHeight: '34px', marginBottom: '6px', fontSize: '0.85rem' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{ 
                    paddingLeft: '12px', 
                    paddingRight: '40px', 
                    width: '100%', 
                    height: '42px', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-light)', 
                    backgroundColor: '#ffffff',
                    fontSize: '0.88rem', 
                    outline: 'none',
                    color: 'var(--text-main)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="input-label" style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'flex-end', minHeight: '34px', marginBottom: '6px', fontSize: '0.85rem' }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{ 
                    paddingLeft: '12px', 
                    paddingRight: '40px', 
                    width: '100%', 
                    height: '42px', 
                    borderRadius: '8px', 
                    border: '1.5px solid var(--border-light)', 
                    backgroundColor: '#ffffff',
                    fontSize: '0.88rem', 
                    outline: 'none',
                    color: 'var(--text-main)'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            style={{ width: '160px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '24px' }}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    );

    if (auth.user?.role === 'SAFEGUARD') {

      const handleSgProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSgUpdateError(null);
        setSgUpdateSuccess(null);

        if (!sgProfileName.trim() || !sgProfileRegion.trim() || !sgProfileCountry.trim()) {
          setSgUpdateError('Name, Region, and Country fields are required.');
          return;
        }

        try {
          const response = await updateSafeguardProfile({
            name: sgProfileName,
            phone: sgProfilePhone,
            region: sgProfileRegion,
            country: sgProfileCountry,
          }).unwrap();

          if (auth.user) {
            dispatch(
              setCredentials({
                user: {
                  ...auth.user,
                  profile: response.safeguard,
                },
              })
            );
          }
          setSgUpdateSuccess('Safeguard profile updated successfully!');
          setIsEditingProfile(false);
        } catch (err: any) {
          setSgUpdateError(err?.data?.error || 'Failed to update profile. Please try again.');
        }
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card-widget" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="panel-title-text" style={{ margin: 0 }}>Safeguard DSL Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isEditingProfile ? 'var(--primary-purple)' : 'none',
                  border: isEditingProfile ? 'none' : '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isEditingProfile ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Pencil size={14} /> {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {sgUpdateError && (
              <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
                ⚠️ {sgUpdateError}
              </div>
            )}

            {sgUpdateSuccess && (
              <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                ✅ {sgUpdateSuccess}
              </div>
            )}

            <form className="form-element" onSubmit={handleSgProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="input-label">DSL Officer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sgProfileName}
                    onChange={(e) => setSgProfileName(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    required
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Login Email (Read-Only)</label>
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
                  <label className="input-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sgProfilePhone}
                    onChange={(e) => setSgProfilePhone(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Education Region</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sgProfileRegion}
                    onChange={(e) => setSgProfileRegion(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    required
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group">
                  <label className="input-label">Country Jurisdiction</label>
                  <input
                    type="text"
                    className="form-input"
                    value={sgProfileCountry}
                    onChange={(e) => setSgProfileCountry(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    required
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>

              {isEditingProfile && (
                <button
                  type="submit"
                  className="login-btn"
                  style={{ width: '140px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '24px' }}
                  disabled={isUpdatingSg}
                >
                  {isUpdatingSg ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
          {renderPasswordForm()}
        </div>
      );
    }

    if (auth.user?.role === 'REGIONAL_ADMIN' || auth.user?.role === 'SUPER_ADMIN') {
      const handleAdminProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdminUpdateSuccess(null);
        setAdminUpdateError(null);
        try {
          const response = await updateProfile({
            name: adminName,
            phone: adminPhone,
          }).unwrap();

          if (auth.user) {
            dispatch(
              setCredentials({
                user: {
                  ...auth.user,
                  profile: response.profile,
                },
              })
            );
          }
          setAdminUpdateSuccess('Administrator profile updated successfully!');
          setIsEditingProfile(false);
        } catch (err: any) {
          setAdminUpdateError(err?.data?.error || 'Failed to update profile. Please try again.');
        }
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card-widget" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ borderLeft: '4px solid var(--primary-purple)', paddingLeft: '12px' }}>
                <h3 className="panel-title-text" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Administrator Account Details</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage your regional administrator profile details.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isEditingProfile ? 'var(--primary-purple)' : 'none',
                  border: isEditingProfile ? 'none' : '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isEditingProfile ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Pencil size={14} /> {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {adminUpdateSuccess && (
              <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                ✅ {adminUpdateSuccess}
              </div>
            )}

            {adminUpdateError && (
              <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
                ❌ {adminUpdateError}
              </div>
            )}

            <form className="form-element" onSubmit={handleAdminProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="input-label" style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Admin Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      style={{ paddingLeft: '38px', width: '100%', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                      required
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="input-label" style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Login Email (Read-Only)</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      value={auth.user?.email || ''}
                      style={{ paddingLeft: '38px', width: '100%', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed', border: '1.5px solid var(--border-light)' }}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div className="form-group">
                  <label className="input-label" style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      style={{ paddingLeft: '38px', width: '100%', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                      disabled={!isEditingProfile}
                    />
                  </div>
                </div>
                {auth.user?.role === 'REGIONAL_ADMIN' && (
                  <div className="form-group">
                    <label className="input-label" style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Education Region Jurisdiction</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        className="form-input"
                        value={adminRegion}
                        style={{ paddingLeft: '38px', width: '100%', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed', border: '1.5px solid var(--border-light)' }}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>

              {isEditingProfile && (
                <button
                  type="submit"
                  className="login-btn"
                  style={{ width: '140px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '28px', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                  disabled={isUpdatingAdmin}
                >
                  {isUpdatingAdmin ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
          {renderPasswordForm()}
        </div>
      );
    }

    if (auth.user?.role === 'STUDENT') {
      const studentProfile = auth.user.profile;

      const handleStudentProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStudentUpdateSuccess(null);
        setStudentUpdateError(null);
        try {
          const response = await updateStudentProfile({
            name: studentNameState,
            dateOfBirth: studentDobState
          }).unwrap();

          if (auth.user) {
            dispatch(
              setCredentials({
                user: {
                  ...auth.user,
                  profile: response.profile
                }
              })
            );
          }
          setStudentUpdateSuccess('Student profile updated successfully!');
          setIsEditingProfile(false);
        } catch (err: any) {
          setStudentUpdateError(err?.data?.error || 'Failed to update profile. Please try again.');
        }
      };

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="card-widget" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 className="panel-title-text" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Student Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isEditingProfile ? 'var(--primary-purple)' : 'none',
                  border: isEditingProfile ? 'none' : '1px solid var(--border-light)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: isEditingProfile ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                <Pencil size={14} /> {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {studentUpdateSuccess && (
              <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                ✅ {studentUpdateSuccess}
              </div>
            )}

            {studentUpdateError && (
              <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
                ❌ {studentUpdateError}
              </div>
            )}

            <form className="form-element" onSubmit={handleStudentProfileSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="input-label">Student Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentNameState}
                    onChange={(e) => setStudentNameState(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    required
                    disabled={!isEditingProfile}
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Login Email / Username (Read-Only)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={auth.user?.email || ''}
                    style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed', border: '1.5px solid var(--border-light)' }}
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
                    value={studentDobState}
                    onChange={(e) => setStudentDobState(e.target.value)}
                    style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                    disabled={!isEditingProfile}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label">Grade / Year Group (Read-Only)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studentProfile?.grade || ''}
                    style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed', border: '1.5px solid var(--border-light)' }}
                    disabled
                  />
                </div>
              </div>

              {isEditingProfile && (
                <button
                  type="submit"
                  className="login-btn"
                  style={{ width: '140px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '24px' }}
                  disabled={isUpdatingStudent}
                >
                  {isUpdatingStudent ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
          {renderPasswordForm()}
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
            })
          );
        }
        setProfileSuccess('Profile updated successfully!');
        setIsEditingProfile(false);
      } catch (err: any) {
        setProfileError(err?.data?.error || 'Failed to update profile. Please try again.');
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="card-widget" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="panel-title-text" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Account Settings</h3>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isEditingProfile ? 'var(--primary-purple)' : 'none',
                border: isEditingProfile ? 'none' : '1px solid var(--border-light)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: isEditingProfile ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <Pencil size={14} /> {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

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
                  style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                  required
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="form-group">
                <label className="input-label">Contact Email (Read-Only)</label>
                <input
                  type="email"
                  className="form-input"
                  value={parentDetails ? parentDetails.email : ''}
                  style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed', border: '1.5px solid var(--border-light)' }}
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
                  style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                  disabled={!isEditingProfile}
                />
              </div>
              <div className="form-group">
                <label className="input-label">Region</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileRegion}
                  onChange={(e) => setProfileRegion(e.target.value)}
                  style={{ paddingLeft: '12px', backgroundColor: isEditingProfile ? '#ffffff' : '#f8fafc', color: isEditingProfile ? 'var(--text-main)' : 'var(--text-secondary)', border: isEditingProfile ? '1.5px solid var(--primary-purple)' : '1.5px solid var(--border-light)' }}
                  required
                  disabled={!isEditingProfile}
                />
              </div>
            </div>

            {isEditingProfile && (
              <button
                type="submit"
                className="login-btn"
                style={{ width: '140px', fontSize: '0.85rem', padding: '10px', border: 'none', marginTop: '24px' }}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </form>
        </div>
        {renderPasswordForm()}
      </div>
    );
  }

  // 12. View Safeguard Officer (Regional Admin only)
  if (pageId === 'register-safeguard') {
    const safeguards = sgData?.safeguards || [];

    const handleRegisterSgSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSgError(null);

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
          product: 'HS'
        }).unwrap();

        setShowSgModal(false);
        setSgName('');
        setSgEmail('');
        setSgPhone('');
        setSgPassword('');
        refetchSgList();
      } catch (err: any) {
        setSgError(err?.data?.error || 'Registration failed. The email might be already taken.');
      }
    };

    return (
      <div className="card-widget" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="panel-title-text" style={{ margin: 0, color: 'var(--text-main)' }}>Designated Safeguarding Lead (DSL)</h3>
          {!isSgListLoading && safeguards.length === 0 && (
            <button
              onClick={() => setShowSgModal(true)}
              className="action-btn-outline"
              style={{ width: 'auto', padding: '6px 14px', cursor: 'pointer', backgroundColor: 'var(--primary-purple)', borderColor: 'var(--primary-purple)', color: 'white', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}
            >
              Register Safeguard
            </button>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Contact details and status of the Designated Safeguarding Lead officer assigned to your education region. Only one officer can be assigned.
        </p>

        {isSgListLoading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Loading safeguarding officer details...
          </div>
        ) : safeguards.length > 0 ? (
          safeguards.map((sg: any) => (
            <div
              key={sg.id}
              className="contact-directory-row"
              style={{
                borderLeft: '4px solid var(--primary-purple)',
                backgroundColor: 'var(--primary-purple-light)',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{sg.name}</span>
                <span style={{
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  backgroundColor: sg.user?.isActive ? '#ecfdf5' : '#fef2f2',
                  color: sg.user?.isActive ? '#047857' : '#b91c1c'
                }}>
                  {sg.user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <div>Email: <strong style={{ color: 'var(--text-main)' }}>{sg.user?.email || 'N/A'}</strong></div>
                <div>Phone: <strong style={{ color: 'var(--text-main)' }}>{sg.phone || 'N/A'}</strong></div>
                <div>Region Jurisdiction: <strong style={{ color: 'var(--text-main)' }}>{sg.region || 'N/A'}</strong></div>
                <div>Country: <strong style={{ color: 'var(--text-main)' }}>{sg.country || 'N/A'}</strong></div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              No safeguarding officer has been assigned to your region ({auth.user?.profile?.region || 'N/A'}) yet. Click "Register Safeguard" to assign one.
            </p>
          </div>
        )}

        {/* Safeguard Registration Modal */}
        {showSgModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card-widget" style={{ maxWidth: '520px', width: '100%', margin: 0, border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 className="panel-title-text" style={{ margin: 0 }}>Register Safeguard Officer</h3>
                <button
                  onClick={() => { setShowSgModal(false); setSgError(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#64748b' }}
                >
                  Cancel
                </button>
              </div>

              {sgError && (
                <div style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #fecaca', marginBottom: '16px' }}>
                  ⚠️ {sgError}
                </div>
              )}

              <form className="form-element" onSubmit={handleRegisterSgSubmit}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
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

                <div className="form-group" style={{ marginBottom: '12px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="input-label">Region (Read-Only)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={sgRegion}
                      style={{ paddingLeft: '12px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Country</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. United Kingdom"
                      value={sgCountry}
                      onChange={(e) => setSgCountry(e.target.value)}
                      style={{ paddingLeft: '12px' }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isRegisteringSg}
                  style={{ width: '100%', border: 'none', margin: 0, padding: '12px', backgroundColor: isRegisteringSg ? '#94a3b8' : 'var(--primary-purple)', color: 'white', cursor: isRegisteringSg ? 'not-allowed' : 'pointer' }}
                >
                  {isRegisteringSg ? 'Registering...' : 'Register Safeguard Officer'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 13. Regional Parents Directory (Regional Admin only)
  if (pageId === 'regional-parents') {
    const parents = parentsData?.parents || [];

    return (
      <div className="card-widget" style={{ maxWidth: '100%', border: '1px solid var(--border-light)', padding: '24px' }}>
        <div style={{ borderLeft: '4px solid var(--primary-purple)', paddingLeft: '12px', marginBottom: '24px' }}>
          <h3 className="panel-title-text" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Parents Directory</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Overview of registered parent accounts, contact details, and their enrolled children. Click any student chip to inspect their profile.
          </p>
        </div>

        {isParentsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Loading parents ledger...
          </div>
        ) : parents.length > 0 ? (
          <div style={{ overflowX: 'auto', marginTop: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <th style={{ padding: '12px 12px', width: '40px' }}></th>
                  <th style={{ padding: '12px 16px', paddingLeft: 0 }}>Parent Name</th>
                  <th style={{ padding: '12px 16px' }}>Email Address</th>
                  <th style={{ padding: '12px 16px' }}>Phone Number</th>
                  <th style={{ padding: '12px 16px' }}>Enrolled Children</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((parent: any) => {
                  const isExpanded = expandedParentId === parent.id;
                  const studentCount = parent.students?.length || 0;

                  return (
                    <React.Fragment key={parent.id}>
                      <tr
                        style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s', cursor: 'pointer' }}
                        onClick={() => setExpandedParentId(isExpanded ? null : parent.id)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-purple-light)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '16px 12px', width: '40px', textAlign: 'center', color: 'var(--primary-purple)' }}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>
                        <td style={{ padding: '16px 16px', paddingLeft: 0, fontWeight: 600, color: 'var(--text-main)' }}>
                          {parent.name}
                        </td>
                        <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                          {parent.user?.email}
                        </td>
                        <td style={{ padding: '16px 16px', color: 'var(--text-secondary)' }}>
                          {parent.phone || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 16px', fontWeight: 500, color: studentCount > 0 ? 'var(--primary-purple)' : 'var(--text-muted)' }}>
                          {studentCount === 0 ? 'No Enrolled Children' : `${studentCount} Enrolled Student${studentCount > 1 ? 's' : ''}`}
                        </td>
                        <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            backgroundColor: parent.user?.isActive ? '#ecfdf5' : '#fef2f2',
                            color: parent.user?.isActive ? '#047857' : '#b91c1c',
                            display: 'inline-block'
                          }}>
                            {parent.user?.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>

                      {/* Collapsible Children Sub-Ledger Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} style={{ backgroundColor: 'var(--bg-portal)', padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
                            <div style={{ borderLeft: '3px solid var(--primary-purple)', paddingLeft: '16px' }}>
                              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Enrolled Children Details</h4>

                              {studentCount > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  {parent.students.map((student: any) => (
                                    <div
                                      key={student.id}
                                      onClick={(e) => {
                                        e.stopPropagation(); // prevent collapsing parent row
                                        setSelectedStudentForModal({ ...student, parentName: parent.name });
                                      }}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px',
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--primary-purple)';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border-light)';
                                        e.currentTarget.style.boxShadow = 'none';
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>🎓</span>
                                        <div>
                                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>{student.name}</div>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            Grade: {student.grade || 'N/A'} | Username: {student.user?.email || 'N/A'}
                                          </div>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                          DOB: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                                        </div>
                                        <span style={{
                                          fontSize: '0.72rem',
                                          padding: '2px 8px',
                                          borderRadius: '10px',
                                          fontWeight: 'bold',
                                          backgroundColor: student.user?.isActive ? '#ecfdf5' : '#fef2f2',
                                          color: student.user?.isActive ? '#047857' : '#b91c1c'
                                        }}>
                                          {student.user?.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                                  No children registered under this parent account.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-light)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
            No parents registered in your region ({auth.user?.profile?.region || 'N/A'}) yet.
          </div>
        )}

        {/* Student Details Modal */}
        {selectedStudentForModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card-widget" style={{ maxWidth: '440px', width: '100%', margin: 0, border: '1px solid var(--border-light)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 className="panel-title-text" style={{ margin: 0, color: 'var(--text-main)' }}>Student Details</h3>
                <button
                  onClick={() => setSelectedStudentForModal(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🎓
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{selectedStudentForModal.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-portal)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'inline-block', marginTop: '4px' }}>
                      {selectedStudentForModal.grade || 'N/A'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>Parent Account</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedStudentForModal.parentName}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>Date of Birth</span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {selectedStudentForModal.dateOfBirth ? new Date(selectedStudentForModal.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>Student Email / Username</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedStudentForModal.user?.email || 'N/A'}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '2px' }}>Account Status</span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      backgroundColor: selectedStudentForModal.user?.isActive ? '#ecfdf5' : '#fef2f2',
                      color: selectedStudentForModal.user?.isActive ? '#047857' : '#b91c1c',
                      display: 'inline-block',
                      marginTop: '2px'
                    }}>
                      {selectedStudentForModal.user?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button
                  onClick={() => setSelectedStudentForModal(null)}
                  className="login-btn"
                  style={{ width: 'auto', padding: '8px 20px', border: 'none', cursor: 'pointer', margin: 0, fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card-widget">
      <h3>Page Not Found</h3>
    </div>
  );
}
