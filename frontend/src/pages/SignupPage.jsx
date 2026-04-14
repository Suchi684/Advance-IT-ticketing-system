import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../services/authService';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#e74c3c' };
    if (score <= 2) return { level: 2, label: 'Fair', color: '#f39c12' };
    if (score <= 3) return { level: 3, label: 'Good', color: '#3498db' };
    return { level: 4, label: 'Strong', color: '#27ae60' };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await signupApi(name, email, password);
      login(res.data.token, { name: res.data.name, email: res.data.email, role: res.data.role });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Signup failed';
      setErrors({ form: message });
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <FiUser size={28} />
          </div>
          <h2>TicketDesk</h2>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {errors.form && (
          <div className="form-error-banner animate-shake">
            <FiAlertCircle />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label><FiUser /> Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError('name'); }}
              placeholder="John Doe"
              autoComplete="name"
            />
            {errors.name && <span className="field-error"><FiAlertCircle size={12} /> {errors.name}</span>}
          </div>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label><FiMail /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              placeholder="agent@company.com"
              autoComplete="email"
            />
            {errors.email && <span className="field-error"><FiAlertCircle size={12} /> {errors.email}</span>}
          </div>
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label><FiLock /> Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`strength-bar ${i <= strength.level ? 'active' : ''}`} style={i <= strength.level ? { backgroundColor: strength.color } : {}} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
            {password && (
              <div className="password-requirements">
                <span className={password.length >= 6 ? 'met' : ''}><FiCheck size={10} /> 6+ characters</span>
                <span className={/[A-Z]/.test(password) ? 'met' : ''}><FiCheck size={10} /> Uppercase</span>
                <span className={/[0-9]/.test(password) ? 'met' : ''}><FiCheck size={10} /> Number</span>
                <span className={/[^A-Za-z0-9]/.test(password) ? 'met' : ''}><FiCheck size={10} /> Special char</span>
              </div>
            )}
            {errors.password && <span className="field-error"><FiAlertCircle size={12} /> {errors.password}</span>}
          </div>
          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label><FiLock /> Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {confirmPassword && password === confirmPassword && (
              <span className="field-success"><FiCheck size={12} /> Passwords match</span>
            )}
            {errors.confirmPassword && <span className="field-error"><FiAlertCircle size={12} /> {errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="btn-loading"><span className="btn-spinner"></span> Creating account...</span> : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
