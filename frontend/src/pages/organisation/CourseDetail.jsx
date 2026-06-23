import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgCourse } from '../../services/courseService';

const OrgCourseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getOrgCourse(id);
        setCourse(res?.data || null);
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
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <button
            type="button"
            onClick={() => navigate('/org/courses')}
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
            View all details of your posted course.
          </p>
        </div>
      </div>

      <div className="fh-container">
        {error ? (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: 'var(--radius)',
            padding: '12px',
            color: '#FCA5A5',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        ) : !course ? (
          <div style={{ color: '#7A9BB5', fontSize: '0.95rem' }}>Course not found.</div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {course.coverImage && (
              <img
                src={course.coverImage}
                alt={course.title}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                style={{
                  width: '100%',
                  maxHeight: '320px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid #2A4A6B'
                }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800 }}>
                {course.title}
              </h2>
              <span className={`fh-badge fh-badge-${course.status}`}>{course.status}</span>
            </div>

            <p style={{ color: '#B8D0E8', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {course.description}
            </p>

            <div style={{ display: 'grid', gap: '8px', borderTop: '1px solid #2A4A6B', paddingTop: '12px' }}>
              {[
                ['Category', course.category || 'N/A'],
                ['Target Audience', course.targetAudience || 'N/A'],
                ['Gender', course.gender || 'N/A'],
                ['Delivery Mode', course.deliveryMode ? course.deliveryMode.replace('_', ' ') : 'N/A'],
                ['Location', course.location || 'N/A'],
                ['Total Slots', course.totalSlots || 'N/A'],
                ['Filled Slots', course.filledSlots || 0],
                ['Start Date', course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'],
                ['End Date', course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A'],
                ['Deadline', course.applicationDeadline ? new Date(course.applicationDeadline).toLocaleDateString() : 'N/A']
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px' }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ color: '#FFFFFF', fontSize: '0.88rem', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}
            </div>

            {Array.isArray(course.applicationQuestions) && course.applicationQuestions.length > 0 && (
              <div style={{ borderTop: '1px solid #2A4A6B', paddingTop: '12px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '0.98rem', fontWeight: 800, marginBottom: '8px' }}>
                  Application Questions
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {course.applicationQuestions.map((q, index) => (
                    <div key={`${q?.question || 'q'}-${index}`} style={{ color: '#B8D0E8', fontSize: '0.88rem' }}>
                      {index + 1}. {q?.question || 'Untitled question'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid #2A4A6B', paddingTop: '12px' }}>
              <Link
                to="/org/courses"
                style={{
                  border: '1px solid #2A4A6B',
                  color: '#B8D0E8',
                  borderRadius: '999px',
                  padding: '8px 14px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Back
              </Link>
              {course.status !== 'published' && (
                <Link
                  to={`/org/courses/${course._id}/edit`}
                  style={{
                    background: '#F5A623',
                    color: '#1E3A5F',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  Edit Course
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgCourseDetail;
