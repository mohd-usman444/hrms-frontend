import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { Briefcase, Plus, X, Search, Edit3, Trash2, Users, CheckCircle, XCircle, Mail } from 'lucide-react';

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    title: '', department: '', requiredSkills: '', experience: '', vacancies: 1, description: '',
  });

  // Invite states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', candidateName: '', jobId: '' });
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/recruitment/jobs');
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch job openings');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingJob(null);
    setForm({ title: '', department: '', requiredSkills: '', experience: '', vacancies: 1, description: '' });
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      department: job.department,
      requiredSkills: job.requiredSkills.join(', '),
      experience: job.experience,
      vacancies: job.vacancies,
      description: job.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/recruitment/jobs/${editingJob._id}`, form);
        toast.success('Job updated successfully');
      } else {
        await api.post('/recruitment/jobs', form);
        toast.success('Job created successfully');
      }
      setShowModal(false);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job opening and all its candidates?')) return;
    try {
      await api.delete(`/recruitment/jobs/${id}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const toggleStatus = async (job) => {
    try {
      const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
      await api.put(`/recruitment/jobs/${job._id}`, { status: newStatus });
      toast.success(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openInvite = (job) => {
    setInviteForm({ email: '', candidateName: '', jobId: job._id });
    setShowInviteModal(true);
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    setSendingInvite(true);
    try {
      await api.post('/recruitment/send-invite', inviteForm);
      toast.success('Invite sent successfully!');
      setShowInviteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invite');
    } finally {
      setSendingInvite(false);
    }
  };

  const filtered = jobs.filter((job) => {
    const matchSearch = !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || job.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openCount = jobs.filter((j) => j.status === 'Open').length;
  const closedCount = jobs.filter((j) => j.status === 'Closed').length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Job Openings</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Job Opening
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass stat-card">
          <div className="stat-icon"><Briefcase size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{jobs.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Openings</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{openCount}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Open</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}><XCircle size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{closedCount}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Closed</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Experience</th>
                <th>Vacancies</th>
                <th>Candidates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No job openings found</td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{job.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {job.requiredSkills.slice(0, 3).join(', ')}{job.requiredSkills.length > 3 ? '...' : ''}
                      </div>
                    </td>
                    <td>{job.department}</td>
                    <td>{job.experience || '—'}</td>
                    <td>{job.vacancies}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                        {job.candidateCount || 0}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${job.status === 'Open' ? 'badge-open' : 'badge-closed'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleStatus(job)}
                        title="Click to toggle"
                      >
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '6px' }} onClick={() => openInvite(job)} title="Send Application Invite">
                          <Mail size={16} />
                        </button>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '6px' }} onClick={() => openEdit(job)} title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: '6px' }} onClick={() => handleDelete(job._id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '550px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingJob ? 'Edit Job Opening' : 'Add Job Opening'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Required Skills (comma separated)</label>
                <input type="text" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, MongoDB" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Experience</label>
                  <input type="text" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 2-4 years" />
                </div>
                <div className="form-group">
                  <label>Vacancies *</label>
                  <input type="number" min="1" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: parseInt(e.target.value) || 1 })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Job description..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setShowInviteModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Mail size={30} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Send Application Invite</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Send an email with a direct application link for this position.</p>
            </div>
            <form onSubmit={handleSendInvite}>
              <div className="form-group">
                <label>Candidate Name (Optional)</label>
                <input type="text" placeholder="e.g. John Doe" value={inviteForm.candidateName} onChange={(e) => setInviteForm({ ...inviteForm, candidateName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Candidate Email *</label>
                <input type="email" placeholder="candidate@example.com" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={sendingInvite}>
                {sendingInvite ? 'Sending...' : 'Send Invite'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;
