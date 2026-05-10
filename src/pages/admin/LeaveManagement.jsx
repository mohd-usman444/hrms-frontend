import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/leave/all');
      setLeaves(data);
    } catch (error) {
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/leave/${id}/status`, { status });
      toast.success(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem' }}>Leave Management</h1>
      
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No leave requests found</td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{leave.employeeId?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{leave.employeeId?.employeeId}</div>
                    </td>
                    <td>{leave.leaveType}</td>
                    <td>
                      <div>{new Date(leave.fromDate).toLocaleDateString()}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>to {new Date(leave.toDate).toLocaleDateString()}</div>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leave.reason}
                    </td>
                    <td>
                      <span className={`badge badge-${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      {leave.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(leave._id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleStatusChange(leave._id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

export default LeaveManagement;
