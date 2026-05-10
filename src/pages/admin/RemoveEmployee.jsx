import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const RemoveEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/admin/employees');
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/employees/${id}`);
        toast.success('Employee removed successfully');
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        toast.error('Failed to remove employee');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>Remove Employee</h1>
      
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No employees found</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: '500' }}>{emp.employeeId}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.email}</td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(emp._id, emp.name)}
                      >
                        Remove
                      </button>
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

export default RemoveEmployee;
