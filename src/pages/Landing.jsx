import { Link } from 'react-router-dom';
import { ShieldCheck, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-container animate-fade-in">
      <div className="landing-header">
        <h1>HRMS Portal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Welcome to the Human Resource Management System. Please select your role to continue.
        </p>
      </div>
      
      <div className="role-cards">
        <Link to="/admin/signin" className="glass role-card">
          <div className="role-icon">
            <ShieldCheck size={40} />
          </div>
          <h2>Admin Login</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access the management dashboard to handle employees, leaves, and attendance.
          </p>
          <div className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Go to Admin
          </div>
        </Link>
        
        <Link to="/user/signin" className="glass role-card">
          <div className="role-icon">
            <Users size={40} />
          </div>
          <h2>Employee Login</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access your personal dashboard to apply for leaves and mark attendance.
          </p>
          <div className="btn btn-primary" style={{ marginTop: 'auto', width: '100%' }}>
            Go to Employee
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
