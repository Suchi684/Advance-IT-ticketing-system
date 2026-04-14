import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await loginApi(email, password);
      login(res.data.token, { name: res.data.name, email: res.data.email, role: res.data.role });
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      if (err.response?.status === 401) {
        setErrors({ form: 'Invalid email or password. Please check your credentials and try again.' });
      } else {
        setErrors({ form: message });
      }
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up">
        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <FiMail size={28} />
          </div>
          <h2>TicketDesk</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {errors.form && (
          <div className="form-error-banner animate-shake">
            <FiAlertCircle />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label><FiMail /> Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
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
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="field-error"><FiAlertCircle size={12} /> {errors.password}</span>}
          </div>
          <div className="forgot-password-row">
            <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="btn-loading"><span className="btn-spinner"></span> Signing in...</span> : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
