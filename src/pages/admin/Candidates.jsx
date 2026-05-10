import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { UserPlus, Search, X, Upload, Eye, Users, Briefcase, CheckCircle, XCircle } from 'lucide-react';

const STATUS_STEPS = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Hired'];
const STATUS_COLORS = {
  Applied: { bg: 'rgba(99,102,241,0.1)', color: '#6366f1', border: 'rgba(99,102,241,0.3)' },
  Shortlisted: { bg: 'rgba(234,179,8,0.1)', color: '#eab308', border: 'rgba(234,179,8,0.3)' },
  Interview: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  Selected: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  Rejected: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  Hired: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
};

const Candidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', skills: '', experience: '', jobOpening: '',
  });

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, []);

  const fetchCandidates = async () => {
    try {
      const { data } = await api.get('/recruitment/candidates');
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/recruitment/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('skills', form.skills);
      formData.append('experience', form.experience);
      formData.append('jobOpening', form.jobOpening);
      if (resumeFile) formData.append('resume', resumeFile);

      await api.post('/recruitment/candidates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Candidate added successfully');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', skills: '', experience: '', jobOpening: '' });
      setResumeFile(null);
      fetchCandidates();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add candidate');
    }
  };

  const filtered = candidates.filter((c) => {
    const matchSearch = !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJob = !filterJob || c.jobOpening?._id === filterJob;
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchJob && matchStatus;
  });

  const totalApplied = candidates.filter((c) => c.status === 'Applied').length;
  const totalShortlisted = candidates.filter((c) => c.status === 'Shortlisted').length;
  const totalSelected = candidates.filter((c) => c.status === 'Selected' || c.status === 'Hired').length;
  const totalRejected = candidates.filter((c) => c.status === 'Rejected').length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1>Candidates</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Add Candidate
        </button>
      </div>

      {/* Stats */}
      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="glass stat-card">
          <div className="stat-icon"><Users size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{candidates.length}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Candidates</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--warning)' }}><Briefcase size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalApplied}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Applied</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)' }}><CheckCircle size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalSelected}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Selected / Hired</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}><XCircle size={24} /></div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalRejected}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)} style={{ width: 'auto', minWidth: '160px' }}>
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
          <option value="">All Status</option>
          {['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Hired'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Applied For</th>
                <th>Experience</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No candidates found</td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const sc = STATUS_COLORS[c.status] || STATUS_COLORS.Applied;
                  return (
                    <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/candidates/${c._id}`)}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.email}</div>
                      </td>
                      <td>
                        <div>{c.jobOpening?.title || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.jobOpening?.department || ''}</div>
                      </td>
                      <td>{c.experience || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {c.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)' }}>{skill}</span>
                          ))}
                          {c.skills.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn" style={{ padding: '0.4rem 0.8rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '6px', fontSize: '0.8rem' }} onClick={(e) => { e.stopPropagation(); navigate(`/admin/candidates/${c._id}`); }}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Candidate Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '550px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Candidate</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Job Opening *</label>
                <select value={form.jobOpening} onChange={(e) => setForm({ ...form, jobOpening: e.target.value })} required>
                  <option value="">Select a job opening</option>
                  {jobs.filter((j) => j.status === 'Open').map((j) => (
                    <option key={j._id} value={j._id}>{j.title} — {j.department}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input type="text" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 3 years" />
              </div>
              <div className="form-group">
                <label>Resume (PDF, DOC, DOCX — max 5MB)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label htmlFor="resume-upload" className="btn" style={{ padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <Upload size={16} /> Choose File
                  </label>
                  <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} style={{ display: 'none' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{resumeFile ? resumeFile.name : 'No file selected'}</span>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Add Candidate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
