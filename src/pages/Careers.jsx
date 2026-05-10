import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, Clock, ChevronRight, Search, Sparkles } from 'lucide-react';

const API = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '')}/api`;

const Careers = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${API}/public/jobs`);
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const filtered = jobs.filter(
    (j) =>
      !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(99,102,241,0.05) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 3vw, 2rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles effect */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${8 + i * 4}px`,
                height: `${8 + i * 4}px`,
                borderRadius: '50%',
                background: `rgba(99,102,241,${0.08 + i * 0.03})`,
                top: `${15 + i * 12}%`,
                left: `${10 + i * 15}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--accent)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={14} /> We're Hiring!
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              background: 'var(--gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Join Our Team
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.125rem',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: '1.7',
            }}
          >
            Discover exciting career opportunities and be part of something extraordinary. Your next chapter starts here.
          </p>

          {/* Search bar */}
          <div
            style={{
              maxWidth: '500px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
            <input
              type="text"
              placeholder="Search positions or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '3rem',
                padding: '0.875rem 1rem 0.875rem 3rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Open Positions
            <span style={{ color: 'var(--accent)', marginLeft: '0.5rem', fontSize: '1rem' }}>({filtered.length})</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem', width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Loading positions...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Briefcase size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>No open positions right now</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Check back later for new opportunities!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/careers/apply/${job._id}`)}
                className="glass"
                style={{
                  padding: '1.5rem 1.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {job.department}
                    </span>
                    {job.experience && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} /> {job.experience}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Briefcase size={14} /> {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
                    </span>
                  </div>
                  {job.requiredSkills.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {job.requiredSkills.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            background: 'rgba(99,102,241,0.08)',
                            color: 'var(--accent)',
                            border: '1px solid rgba(99,102,241,0.15)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+{job.requiredSkills.length - 5}</span>
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-15px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Careers;
