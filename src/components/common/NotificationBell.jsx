import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className="icon-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px' }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge" style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'var(--accent)',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            border: '2px solid #1a1a2e'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="glass notification-dropdown" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '320px',
          maxHeight: '400px',
          overflowY: 'auto',
          zIndex: 1000,
          marginTop: '10px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{notification.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{notification.message}</p>
                  {notification.link && (
                    <Link 
                      to={notification.link} 
                      style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.5rem', display: 'inline-block', textDecoration: 'none' }}
                      onClick={() => setIsOpen(false)}
                    >
                      View details
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
