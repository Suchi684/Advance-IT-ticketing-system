import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup as signupApi } from '../services/authService';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signupApi(name, email, password);
      login(res.data.token, { name: res.data.name, email: res.data.email, role: res.data.role });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>TicketDesk</h2>
        <p className="auth-subtitle">Create your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiUser /> Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="agent@company.com" />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
