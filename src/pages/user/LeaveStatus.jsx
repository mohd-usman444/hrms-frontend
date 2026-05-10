import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const LeaveStatus = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/leave/my');
      setLeaves(data);
    } catch (error) {
      toast.error('Failed to fetch your leave requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>My Leave Status</h1>
      
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>You haven't applied for any leaves yet</td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td style={{ fontWeight: '500' }}>{leave.leaveType}</td>
                    <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leave.reason}
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {new Date(leave.appliedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge badge-${leave.status.toLowerCase()}`}>
                        {leave.status}
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

export default LeaveStatus;
