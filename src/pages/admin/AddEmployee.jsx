import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/admin/employees', formData);
      toast.success('Employee added successfully');
      setFormData({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        password: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Add New Employee</h1>
      
      <div className="glass" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Employee ID</label>
            <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Temporary Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
