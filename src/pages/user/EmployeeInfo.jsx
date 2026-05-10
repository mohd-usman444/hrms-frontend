import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const EmployeeInfo = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/employee/profile');
      setProfile(data);
      setPhone(data.phone || '');
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await api.put('/employee/profile', { phone });
      setProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>My Profile</h1>
      
      <div className="glass" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'var(--gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
        }}>
          {profile?.name?.charAt(0)}
        </div>

        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Full Name</div>
            <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>{profile?.name}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Employee ID</div>
            <div style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--accent)' }}>{profile?.employeeId}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Email</div>
            <div style={{ fontSize: '1.125rem' }}>{profile?.email}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</div>
            <div style={{ fontSize: '1.125rem' }}>{profile?.department}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Join Date</div>
            <div style={{ fontSize: '1.125rem' }}>{new Date(profile?.joinDate).toLocaleDateString()}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Phone</span>
              {!isEditing && (
                <span style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => setIsEditing(true)}>Edit</span>
              )}
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  style={{ padding: '0.4rem 0.8rem' }}
                />
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={handleUpdate}>Save</button>
              </div>
            ) : (
              <div style={{ fontSize: '1.125rem' }}>{profile?.phone || 'Not provided'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfo;
