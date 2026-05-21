import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = searchParams.get('role') || 'employee';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(`Simulated reset link sent to ${email}`);
    }, 1200);
  };

  const getBackPath = () => {
    return role === 'admin' ? '/admin/signin' : '/user/signin';
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass auth-card">
        {!submitted ? (
          <>
            <div className="auth-header">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent)' }}>
                <KeyRound size={48} />
              </div>
              <h1>Forgot Password?</h1>
              <p>Enter your email address to receive a secure reset link.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your registered email"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                  <div style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span 
                style={{ 
                  color: 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  fontSize: '0.875rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'color 0.2s'
                }}
                onClick={() => navigate(getBackPath())}
                className="forgot-password-link"
              >
                <ArrowLeft size={16} /> Back to Login
              </span>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success)' }}>
              <CheckCircle2 size={56} className="animate-fade-in" />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Check Your Email</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              A simulated password reset link has been sent to: <br />
              <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
            </p>
            
            <div className="glass" style={{ 
              padding: '1rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              color: 'var(--text-secondary)', 
              textAlign: 'left',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)'
            }}>
              <span style={{ fontWeight: '600', color: 'var(--accent)', display: 'block', marginBottom: '0.25rem' }}>HRMS Demo Info:</span>
              Since this application does not have a live SMTP service or real backend password reset routing configured, the reset link generation has been simulated on the client side.
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => navigate(getBackPath())}
            >
              Return to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
