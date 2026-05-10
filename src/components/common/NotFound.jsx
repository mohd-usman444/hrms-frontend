import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="auth-container">
      <div className="glass auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
