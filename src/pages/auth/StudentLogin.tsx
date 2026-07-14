import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertTriangle, Eye, EyeOff, BookOpen, ChevronLeft } from 'lucide-react';
import { useLoginStudentMutation, useForgotPasswordMutation, useResetPasswordMutation } from '../../store/apiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginProps {
  onLoginSuccess: (username: string, role: string) => void;
}

export default function StudentLogin({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [loginStudent, { isLoading }] = useLoginStudentMutation();
  const [forgotPasswordMutation, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [resetPasswordMutation, { isLoading: isResetLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginStudent({ email, password }).unwrap();
      dispatch(setCredentials({ user: response.user }));
      onLoginSuccess(response.user.profile?.name || email.split('@')[0], 'student');
    } catch (err: any) {
      setError(err?.data?.error || 'Invalid credentials or connection error.');
    }
  };

  const goBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .hs-login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #f7f5ef;
        }

        /* LEFT PANEL */
        .hs-login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2rem;
          background: #fff;
          position: relative;
        }

        .hs-login-back {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #5a6557;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
        }
        .hs-login-back:hover { background: #f0ede4; color: #c06d48; }

        .hs-login-card { width: 100%; max-width: 420px; }

        /* Brand */
        .hs-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 2rem;
        }
        .hs-brand-mark {
          width: 48px;
          height: 48px;
          background: #c06d48;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .hs-brand-name { font-size: 22px; font-weight: 700; color: #2b352a; letter-spacing: 0.06em; }
        .hs-brand-sub  { font-size: 12px; color: #5a6557; letter-spacing: 0.04em; }

        /* Heading */
        .hs-login-heading { font-size: 20px; font-weight: 700; color: #2b352a; margin-bottom: 4px; text-align: center; }
        .hs-login-sub { font-size: 13.5px; color: #5a6557; text-align: center; margin-bottom: 1.75rem; }

        /* Error */
        .hs-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          font-size: 13px;
          color: #b91c1c;
          margin-bottom: 1rem;
        }

        /* Form */
        .hs-form { display: flex; flex-direction: column; gap: 1rem; }
        .hs-field { display: flex; flex-direction: column; gap: 6px; }
        .hs-label { font-size: 13px; font-weight: 500; color: #3b4539; }
        .hs-label-row { display: flex; align-items: center; justify-content: space-between; }
        .hs-forgot { font-size: 12px; color: #c06d48; text-decoration: none; font-weight: 500; }
        .hs-forgot:hover { text-decoration: underline; }

        .hs-input-wrap { position: relative; display: flex; align-items: center; }
        .hs-input-icon { position: absolute; left: 12px; color: #7b8878; pointer-events: none; }
        .hs-input {
          width: 100%;
          padding: 11px 40px 11px 38px;
          border: 1.5px solid #dfdacd;
          border-radius: 9px;
          font-size: 14px;
          color: #2b352a;
          background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .hs-input:focus { border-color: #c06d48; box-shadow: 0 0 0 3px rgba(192,109,72,0.1); }
        .hs-input::placeholder { color: #7b8878; }
        .hs-input:disabled { background: #fcfbf9; cursor: not-allowed; }

        .hs-eye-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #7b8878;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.15s;
        }
        .hs-eye-btn:hover { color: #5a6557; }

        /* Submit */
        .hs-submit-btn {
          width: 100%;
          padding: 12px;
          background: #c06d48;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          transition: background 0.15s, transform 0.1s;
          margin-top: 4px;
        }
        .hs-submit-btn:hover:not(:disabled) { background: #a55a36; transform: translateY(-1px); }
        .hs-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        @keyframes hs-spin { to { transform: rotate(360deg); } }
        .hs-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: hs-spin 0.7s linear infinite;
        }

        /* RIGHT PANEL */
        .hs-login-right {
          flex: 1;
          background: linear-gradient(145deg, #c06d48 0%, #2b352a 60%, #1c241b 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 768px) { .hs-login-right { display: none; } }

        .hs-right-blob-1 {
          position: absolute;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(192,109,72,0.15) 0%, transparent 70%);
          top: -80px; right: -80px;
          pointer-events: none;
        }
        .hs-right-blob-2 {
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(223,218,205,0.08) 0%, transparent 70%);
          bottom: -60px; left: -60px;
          pointer-events: none;
        }

        .hs-right-content { position: relative; z-index: 1; max-width: 420px; text-align: center; }

        .hs-right-img-wrap {
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .hs-right-img { width: 100%; height: 260px; object-fit: cover; display: block; }

        .hs-right-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 5px 14px;
          font-size: 11px;
          color: #f0ede4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .hs-right-badge svg { color: #dfdacd; }

        .hs-right-quote {
          font-size: 16px;
          color: #f0ede4;
          line-height: 1.75;
          font-style: italic;
          margin-bottom: 1.25rem;
        }
        .hs-right-quote::before { content: '\\201C'; font-size: 22px; color: #dfdacd; margin-right: 2px; }
        .hs-right-quote::after  { content: '\\201D'; font-size: 22px; color: #dfdacd; margin-left: 2px; }

        .hs-right-attr { font-size: 12px; color: #c3ccbf; }
        .hs-right-attr strong { color: #f0ede4; font-weight: 600; }
      `}</style>

      <div className="hs-login-page">

        {/* LEFT */}
        <div className="hs-login-left">
          {showForgotPassword ? (
            <>
              <button className="hs-login-back" onClick={() => { setShowForgotPassword(false); setForgotStep(1); setForgotError(null); setForgotMessage(null); }}>
                <ChevronLeft size={16} /> Back to Sign In
              </button>
              
              <div className="hs-login-card">
                <div className="hs-brand">
                  <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
                  <span className="hs-brand-name">LSA</span>
                  <span className="hs-brand-sub">Password Recovery</span>
                </div>

                <h2 className="hs-login-heading">Forgot Password</h2>
                <p className="hs-login-sub">Reset your account password using your email address</p>

                {forgotError && (
                  <div className="hs-error">
                    <AlertTriangle size={15} />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotMessage && (
                  <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid #bbf7d0', marginBottom: '16px' }}>
                    ✅ {forgotMessage}
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotError(null);
                    setForgotMessage(null);
                    try {
                      await forgotPasswordMutation({ email: forgotEmail }).unwrap();
                      setForgotStep(2);
                      setForgotMessage('Verification code sent to your email.');
                    } catch (err: any) {
                      setForgotError(err?.data?.error || 'Failed to send verification code.');
                    }
                  }} className="hs-form">
                    <div className="hs-field">
                      <label className="hs-label">Email address</label>
                      <div className="hs-input-wrap">
                        <Mail size={15} className="hs-input-icon" />
                        <input
                          type="email"
                          className="hs-input"
                          placeholder="student@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          disabled={isForgotLoading}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="hs-submit-btn" disabled={isForgotLoading}>
                      {isForgotLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotError(null);
                    setForgotMessage(null);
                    try {
                      await resetPasswordMutation({ email: forgotEmail, otp, newPassword }).unwrap();
                      setForgotMessage('Password reset successful! Redirecting to login...');
                      setTimeout(() => {
                        setShowForgotPassword(false);
                        setForgotStep(1);
                        setForgotEmail('');
                        setOtp('');
                        setNewPassword('');
                        setForgotMessage(null);
                      }, 2500);
                    } catch (err: any) {
                      setForgotError(err?.data?.error || 'Failed to reset password.');
                    }
                  }} className="hs-form">
                    <div className="hs-field">
                      <label className="hs-label">Verification Code (OTP)</label>
                      <input
                        type="text"
                        className="hs-input"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isResetLoading}
                        required
                      />
                    </div>
                    <div className="hs-field" style={{ marginTop: '16px' }}>
                      <label className="hs-label">New Password</label>
                      <input
                        type="password"
                        className="hs-input"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isResetLoading}
                        required
                      />
                    </div>
                    <button type="submit" className="hs-submit-btn" style={{ marginTop: '24px' }} disabled={isResetLoading}>
                      {isResetLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="hs-login-back" onClick={goBack}>
                <ChevronLeft size={16} /> Back to home
              </button>

              <div className="hs-login-card">
                <div className="hs-brand">
                  <img src="/ilmee_logo.png" alt="ILMEE Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'contain', marginBottom: '8px' }} />
                  <span className="hs-brand-name">LSA</span>
                  <span className="hs-brand-sub">Student Portal</span>
                </div>

                <h2 className="hs-login-heading">Student Sign In</h2>
                <p className="hs-login-sub">Enter your credentials to enter your learning space</p>

                {error && (
                  <div className="hs-error">
                    <AlertTriangle size={15} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="hs-form">
                  <div className="hs-field">
                    <label className="hs-label">Username or Email</label>
                    <div className="hs-input-wrap">
                      <Mail size={15} className="hs-input-icon" />
                      <input
                        type="text"
                        className="hs-input"
                        placeholder="student-username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="hs-field">
                    <div className="hs-label-row">
                      <label className="hs-label">Password</label>
                      <button type="button" onClick={() => { setShowForgotPassword(true); setForgotStep(1); }} className="hs-forgot" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
                    </div>
                    <div className="hs-input-wrap">
                      <Lock size={15} className="hs-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="hs-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        className="hs-eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="hs-submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <><div className="hs-spinner" /> Signing in…</>
                    ) : (
                      <>Sign in as Student <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="hs-login-right">
          <div className="hs-right-blob-1" />
          <div className="hs-right-blob-2" />
          <div className="hs-right-content">
            <div className="hs-right-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=700"
                alt="Student learning"
                className="hs-right-img"
              />
            </div>

            <div className="hs-right-badge">
              <BookOpen size={11} /> Student Learning Hub
            </div>

            <p className="hs-right-quote">
              I can check my schedule, answer questions, watch lessons, and send homework to my parents with ease.
            </p>
            <p className="hs-right-attr">
              <strong>Alex Johnson</strong> · Year 5 Student
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
