import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: 'Casual',
    fromDate: '',
    toDate: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      return toast.error('To Date cannot be before From Date');
    }

    setLoading(true);
    try {
      await api.post('/leave/apply', formData);
      toast.success('Leave applied successfully');
      navigate('/user/leave-status');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Apply for Leave</h1>
      
      <div className="glass" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Leave Type</label>
            <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Annual">Annual Leave</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>From Date</label>
              <input 
                type="date" 
                name="fromDate" 
                value={formData.fromDate} 
                onChange={handleChange} 
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>To Date</label>
              <input 
                type="date" 
                name="toDate" 
                value={formData.toDate} 
                onChange={handleChange} 
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
          </div>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label>Reason</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              rows="4"
              placeholder="Please provide a reason for your leave request..."
              required 
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
