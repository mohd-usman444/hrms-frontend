import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const MarkAttendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/attendance/my');
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPresent = async () => {
    setMarking(true);
    try {
      await api.post('/attendance/mark');
      toast.success('Attendance marked for today!');
      fetchHistory(); // Refresh history
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  const todayStr = new Date().toLocaleDateString();
  const alreadyMarked = history.some(record => new Date(record.date).toLocaleDateString() === todayStr);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Attendance</h1>
      
      <div className="glass" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', fontFamily: 'monospace' }}>
          {new Date().toLocaleTimeString('en-US')}
        </div>
        
        {alreadyMarked ? (
          <div style={{ 
            display: 'inline-block',
            padding: '1rem 2rem', 
            background: 'rgba(34, 197, 94, 0.1)', 
            color: 'var(--success)', 
            borderRadius: '12px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            fontWeight: '600',
            fontSize: '1.25rem'
          }}>
            ✓ Present for Today
          </div>
        ) : (
          <button 
            className="btn btn-primary" 
            style={{ padding: '1rem 3rem', fontSize: '1.25rem', borderRadius: '12px' }}
            onClick={handleMarkPresent}
            disabled={marking}
          >
            {marking ? 'Marking...' : 'Mark Present'}
          </button>
        )}
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Past 30 Days</h2>
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No recent attendance records</td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-approved' : 'badge-rejected'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
