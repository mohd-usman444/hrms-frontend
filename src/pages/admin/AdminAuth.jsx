import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminSecretKey: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/admin/signin' : '/api/auth/admin/signup';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      login(data, data.token);
      toast.success(isLogin ? 'Login successful!' : 'Admin registered successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
            <ShieldCheck size={48} />
          </div>
          <h1>Admin {isLogin ? 'Login' : 'Registration'}</h1>
          <p>Access the HRMS Management Dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Admin Secret Key</label>
              <input
                type="password"
                name="adminSecretKey"
                value={formData.adminSecretKey}
                onChange={handleChange}
                required
                placeholder="Provided by IT"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register Admin')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an admin account? " : "Already have an admin account? "}
          <span 
            style={{ color: 'var(--accent)', cursor: 'pointer' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
