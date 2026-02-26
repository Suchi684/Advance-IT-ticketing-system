import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';
import { toast } from 'react-toastify';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      login(res.data.token, { name: res.data.name, email: res.data.email, role: res.data.role });
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>TicketDesk</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="agent@company.com" />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
