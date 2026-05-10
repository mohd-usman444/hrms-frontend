import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, Briefcase, MapPin, Clock, Users, CheckCircle, Send } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL}/api`;

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    coverLetter: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${API}/public/jobs/${jobId}`);
      setJob(data);
    } catch (err) {
      setError('Job not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('skills', form.skills);
      formData.append('experience', form.experience);
      formData.append('coverLetter', form.coverLetter);
      formData.append('jobOpening', jobId);
      if (resumeFile) formData.append('resume', resumeFile);

      await axios.post(`${API}/public/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          Loading job details...
        </div>
      </div>
    );
  }

  // Error - Job not found
  if (!job && error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Briefcase size={36} style={{ color: 'var(--danger)' }} />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Position Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/careers')}>
            <ArrowLeft size={16} /> Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  // Success - Application submitted
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '2px solid rgba(34,197,94,0.3)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <CheckCircle size={42} style={{ color: '#22c55e' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem' }}>Application Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '0.5rem' }}>
            Thank you for applying for <strong style={{ color: 'var(--accent)' }}>{job.title}</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem' }}>
            We've received your application and will review it shortly. You'll receive a confirmation email with the details.
          </p>
          <div
            className="glass"
            style={{
              padding: '1.25rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              Application Summary
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Position</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{job.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{job.department}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</span>
              <span style={{ fontWeight: '500', fontSize: '0.875rem', color: '#22c55e' }}>✅ Applied</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/careers')}>
            Browse More Jobs
          </button>
        </div>
        <style>{`
          @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.2); } 50% { box-shadow: 0 0 0 15px rgba(34,197,94,0); } }
        `}</style>
      </div>
    );
  }

  // Application Form
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => navigate('/careers')}
          style={{
            background: 'rgba(99,102,241,0.1)',
            color: 'var(--accent)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Back to all positions</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Job Details Card */}
          <div>
            <div
              className="glass"
              style={{
                padding: '2rem',
                position: 'sticky',
                top: '2rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(34,197,94,0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Actively Hiring
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{job.title}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} style={{ color: 'var(--accent)' }} /> {job.department}
                </div>
                {job.experience && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Clock size={16} style={{ color: 'var(--accent)' }} /> {job.experience}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Users size={16} style={{ color: 'var(--accent)' }} /> {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
                </div>
              </div>

              {job.description && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{job.description}</p>
                </div>
              )}

              {job.requiredSkills.length > 0 && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Required Skills</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {job.requiredSkills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.25rem 0.7rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          background: 'rgba(99,102,241,0.1)',
                          color: 'var(--accent)',
                          border: '1px solid rgba(99,102,241,0.2)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Application Form */}
          <div>
            <div className="glass" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>Apply for this Position</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Fill out the form below. Fields marked * are required.</p>

              {error && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, MongoDB"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 years"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us why you'd be a great fit for this role..."
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-group">
                  <label>Resume (PDF, DOC, DOCX — max 5MB)</label>
                  <div
                    style={{
                      border: '2px dashed rgba(99,102,241,0.3)',
                      borderRadius: '10px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      background: resumeFile ? 'rgba(34,197,94,0.05)' : 'rgba(99,102,241,0.03)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('resume-file').click()}
                  >
                    <input
                      id="resume-file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    {resumeFile ? (
                      <div>
                        <CheckCircle size={24} style={{ color: '#22c55e', marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{resumeFile.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={24} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>Drop your resume or click to upload</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>PDF, DOC, DOCX (max 5MB)</div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.875rem',
                    fontSize: '1rem',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? (
                    <>
                      <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ApplyJob;
