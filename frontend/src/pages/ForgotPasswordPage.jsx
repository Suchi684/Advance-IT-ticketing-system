import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePasswords = () => {
    const errs = {};
    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setStep(2);
    setErrors({});
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    setLoading(true);
    setErrors({});
    try {
      await resetPassword(email, newPassword);
      setSuccess(true);
      toast.success('Password reset successful!');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Password reset failed';
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-in-up">
          <div className="auth-logo-section">
            <div className="auth-logo-icon success-icon">
              <FiCheckCircle size={28} />
            </div>
            <h2>Password Reset</h2>
            <p className="auth-subtitle">Your password has been successfully reset</p>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <FiLock size={28} />
          </div>
          <h2>Reset Password</h2>
          <p className="auth-subtitle">
            {step === 1 ? 'Enter your email address' : 'Create a new password'}
          </p>
        </div>

        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {errors.form && (
          <div className="form-error-banner animate-shake">
            <FiAlertCircle />
            <span>{errors.form}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} noValidate>
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label><FiMail /> Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                placeholder="Enter your registered email"
                autoComplete="email"
                autoFocus
              />
              {errors.email && <span className="field-error"><FiAlertCircle size={12} /> {errors.email}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit} noValidate>
            <div className="form-group">
              <label><FiMail /> Email</label>
              <input type="email" value={email} disabled className="input-disabled" />
            </div>
            <div className={`form-group ${errors.newPassword ? 'has-error' : ''}`}>
              <label><FiLock /> New Password</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setErrors(prev => ({ ...prev, newPassword: '' })); }}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  autoFocus
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.newPassword && <span className="field-error"><FiAlertCircle size={12} /> {errors.newPassword}</span>}
            </div>
            <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
              <label><FiLock /> Confirm Password</label>
              <div className="input-with-icon">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error"><FiAlertCircle size={12} /> {errors.confirmPassword}</span>}
            </div>
            <div className="form-actions-row">
              <button type="button" className="btn btn-secondary" onClick={() => { setStep(1); setErrors({}); }}>
                <FiArrowLeft /> Back
              </button>
              <button type="submit" className="btn btn-primary btn-flex-grow" disabled={loading}>
                {loading ? <span className="btn-loading"><span className="btn-spinner"></span> Resetting...</span> : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <p className="auth-link">
          <Link to="/login"><FiArrowLeft size={12} /> Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
