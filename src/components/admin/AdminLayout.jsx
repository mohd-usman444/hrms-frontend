import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, Calendar, UserPlus, UserMinus, FileText, LogOut, Briefcase, UserCheck, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { logout, adminUser: user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin/dashboard', icon: <Users size={20} />, label: 'Employee Data' },
    { path: '/admin/leave', icon: <Calendar size={20} />, label: 'Leave Management' },
    { path: '/admin/add-employee', icon: <UserPlus size={20} />, label: 'Add Employee' },
    { path: '/admin/remove-employee', icon: <UserMinus size={20} />, label: 'Remove Employee' },
    { path: '/admin/attendance', icon: <FileText size={20} />, label: 'Attendance Report' },
    { path: '/admin/job-openings', icon: <Briefcase size={20} />, label: 'Job Openings' },
    { path: '/admin/candidates', icon: <UserCheck size={20} />, label: 'Candidates' },
  ];

  return (
    <div className="app-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
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
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Administrator</div>
            </div>
          </div>
          <button onClick={() => logout('admin')} className="btn" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', justifyContent: 'flex-start' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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

export default AdminLayout;
