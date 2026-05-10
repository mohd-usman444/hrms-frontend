import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, Download, Star, Calendar, Clock, User, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const PIPELINE = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Hired'];

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interview form
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', interviewer: '' });
  // Feedback form
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, comments: '' });
  // Hire form
  const [hireForm, setHireForm] = useState({ employeeId: '', password: '', department: '', joinDate: '' });
  const [showHireModal, setShowHireModal] = useState(false);

  useEffect(() => { fetchCandidate(); }, [id]);

  const fetchCandidate = async () => {
    try {
      const { data } = await api.get(`/recruitment/candidates/${id}`);
      setCandidate(data);
      if (data.interview) {
        setInterviewForm({
          date: data.interview.date || '',
          time: data.interview.time || '',
          interviewer: data.interview.interviewer || '',
        });
        setFeedbackForm({
          rating: data.interview.feedback?.rating || 0,
          comments: data.interview.feedback?.comments || '',
        });
      }
      if (data.jobOpening) {
        setHireForm((prev) => ({ ...prev, department: data.jobOpening.department || '' }));
      }
    } catch (error) {
      toast.error('Failed to fetch candidate');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.put(`/recruitment/candidates/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchCandidate();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleInterview = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/recruitment/candidates/${id}/interview`, interviewForm);
      toast.success('Interview scheduled');
      fetchCandidate();
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/recruitment/candidates/${id}/feedback`, feedbackForm);
      toast.success('Feedback saved');
      fetchCandidate();
    } catch (error) {
      toast.error('Failed to save feedback');
    }
  };

  const handleHire = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/recruitment/candidates/${id}/hire`, hireForm);
      toast.success('Candidate hired and added as employee!');
      setShowHireModal(false);
      fetchCandidate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to hire candidate');
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}><Spinner /></div>;
  if (!candidate) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Candidate not found</div>;

  const currentStep = PIPELINE.indexOf(candidate.status);
  const isRejected = candidate.status === 'Rejected';
  const isHired = candidate.status === 'Hired';

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn" style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '8px' }} onClick={() => navigate('/admin/candidates')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>{candidate.name}</h1>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Applied for <strong style={{ color: 'var(--accent)' }}>{candidate.jobOpening?.title || '—'}</strong> · {candidate.jobOpening?.department || ''}
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Application Pipeline</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          {PIPELINE.map((step, i) => {
            const isActive = i === currentStep && !isRejected;
            const isPast = i < currentStep && !isRejected;
            const bgColor = isActive ? 'var(--accent)' : isPast ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)';
            const textColor = isActive ? '#fff' : isPast ? 'var(--success)' : 'var(--text-secondary)';
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', background: bgColor, color: textColor,
                  fontWeight: isActive ? '600' : '400', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                }}>
                  {isPast && <CheckCircle size={14} />}
                  {step}
                </div>
                {i < PIPELINE.length - 1 && <ChevronRight size={16} style={{ color: 'var(--text-secondary)', margin: '0 0.15rem' }} />}
              </div>
            );
          })}
          {isRejected && (
            <div style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={14} /> Rejected
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isHired && !isRejected && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {currentStep < PIPELINE.length - 1 && candidate.status !== 'Selected' && (
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateStatus(PIPELINE[currentStep + 1])}>
                Advance to {PIPELINE[currentStep + 1]}
              </button>
            )}
            {candidate.status === 'Selected' && (
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => setShowHireModal(true)}>
                <CheckCircle size={16} /> Hire as Employee
              </button>
            )}
            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => updateStatus('Rejected')}>
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
        {isHired && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: '500', fontSize: '0.875rem' }}>
            ✅ This candidate has been hired and added as an employee.
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Candidate Info */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Candidate Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Email', value: candidate.email },
              { label: 'Phone', value: candidate.phone },
              { label: 'Experience', value: candidate.experience || '—' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.label}</span>
                <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.value}</span>
              </div>
            ))}
            <div style={{ padding: '0.5rem 0' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Skills</span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {candidate.skills.length > 0 ? candidate.skills.map((skill, i) => (
                  <span key={i} style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)' }}>{skill}</span>
                )) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>—</span>}
              </div>
            </div>
            {candidate.resumePath && (
              <a href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')}${candidate.resumePath}`} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '0.5rem 1rem', background: 'rgba(99,102,241,0.1)', color: 'var(--accent)', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
                <Download size={16} /> Download Resume
              </a>
            )}
          </div>
        </div>

        {/* Interview Section */}
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Interview Management</h3>

          {/* Schedule Form */}
          <form onSubmit={handleInterview} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Schedule Interview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem' }}><Calendar size={12} style={{ marginRight: '4px' }} />Date</label>
                <input type="date" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem' }}><Clock size={12} style={{ marginRight: '4px' }} />Time</label>
                <input type="time" value={interviewForm.time} onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem' }}><User size={12} style={{ marginRight: '4px' }} />Interviewer</label>
              <input type="text" placeholder="Interviewer name" value={interviewForm.interviewer} onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
              Save Interview Details
            </button>
          </form>

          {/* Feedback Form */}
          <form onSubmit={handleFeedback}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>Interview Feedback</div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem' }}>Rating</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                    style={{ background: 'none', padding: '0.25rem', color: star <= feedbackForm.rating ? '#eab308' : 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }}
                  >
                    <Star size={22} fill={star <= feedbackForm.rating ? '#eab308' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem' }}>Comments</label>
              <textarea rows="3" placeholder="Interview feedback..." value={feedbackForm.comments} onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}>
              Save Feedback
            </button>
          </form>
        </div>
      </div>

      {/* Hire Modal */}
      {showHireModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowHireModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)' }}>✕</button>
            <h2 style={{ marginBottom: '0.5rem' }}>Hire as Employee</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Create an employee account for <strong style={{ color: 'var(--text-primary)' }}>{candidate.name}</strong></p>
            <form onSubmit={handleHire}>
              <div className="form-group">
                <label>Employee ID *</label>
                <input type="text" placeholder="e.g. emp1006" value={hireForm.employeeId} onChange={(e) => setHireForm({ ...hireForm, employeeId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" placeholder="Initial password" value={hireForm.password} onChange={(e) => setHireForm({ ...hireForm, password: e.target.value })} required minLength={6} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" value={hireForm.department} onChange={(e) => setHireForm({ ...hireForm, department: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input type="date" value={hireForm.joinDate} onChange={(e) => setHireForm({ ...hireForm, joinDate: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <CheckCircle size={16} /> Confirm Hire
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDetails;
