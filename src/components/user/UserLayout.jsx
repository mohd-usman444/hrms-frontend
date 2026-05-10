import { NavLink, Outlet } from 'react-router-dom';
import { User, CalendarPlus, Clock, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';

const UserLayout = () => {
  const { logout, employeeUser: user } = useAuth();

  const navItems = [
    { path: '/user/dashboard', icon: <User size={20} />, label: 'My Profile' },
    { path: '/user/apply-leave', icon: <CalendarPlus size={20} />, label: 'Apply Leave' },
    { path: '/user/leave-status', icon: <Clock size={20} />, label: 'Leave Status' },
    { path: '/user/attendance', icon: <CheckCircle size={20} />, label: 'Mark Attendance' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Employee Portal</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/user/dashboard'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.employeeId}</div>
            </div>
          </div>
          <button onClick={() => logout('user')} className="btn" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', justifyContent: 'flex-start' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div></div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <NotificationBell />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
