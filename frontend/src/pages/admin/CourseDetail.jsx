import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const AdminCourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/admin/courses/${id}`);
        setCourse(res?.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <div className="fh-section-head">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5A623',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
              marginBottom: '8px'
            }}
          >
            ← Back to Courses
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
            Course Details
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            View course, organisation, and youth profiles.
          </p>
        </div>
      </div>

      <div className="fh-container">
        {error ? (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: '12px',
            padding: '12px',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        ) : !course ? (
          <div style={{ color: '#7A9BB5' }}>Course not found.</div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.22rem', fontWeight: 800, margin: 0 }}>
                {course.title}
              </h2>
              <span className={`fh-badge fh-badge-${course.status}`}>{course.status}</span>
            </div>

            <div style={{ display: 'grid', gap: '8px', borderTop: '1px solid #2A4A6B', paddingTop: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px' }}>
                <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>Organisation</span>
                <Link
                  to={`/profiles/organisation/${course.organisation?._id}`}
                  style={{ color: '#F5A623', fontSize: '0.88rem', textDecoration: 'underline' }}
                >
                  {course.organisation?.name || 'Organisation'}
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px' }}>
                <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>Location</span>
                <span style={{ color: '#FFFFFF', fontSize: '0.88rem' }}>{course.location || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px' }}>
                <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>Category</span>
                <span style={{ color: '#FFFFFF', fontSize: '0.88rem' }}>{course.category || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px' }}>
                <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>Deadline</span>
                <span style={{ color: '#FFFFFF', fontSize: '0.88rem' }}>
                  {course.applicationDeadline ? new Date(course.applicationDeadline).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #2A4A6B', paddingTop: '12px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '0.98rem', fontWeight: 800, marginBottom: '8px' }}>
                Youth Applicants
              </h3>
              {!Array.isArray(course.applicants) || course.applicants.length === 0 ? (
                <p style={{ color: '#7A9BB5', fontSize: '0.88rem' }}>No applications yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {course.applicants.map((applicant) => (
                    <div key={`${applicant.id}-${applicant.appliedAt}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <Link
                        to={`/profiles/youth/${applicant.id}`}
                        style={{ color: '#B8D0E8', textDecoration: 'underline', fontSize: '0.88rem' }}
                      >
                        {applicant.fullName}
                      </Link>
                      <span className={`fh-badge fh-badge-${applicant.status || 'submitted'}`}>
                        {applicant.status || 'submitted'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseDetail;
