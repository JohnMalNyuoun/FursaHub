import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import CourseCard from '../../components/youth/CourseCard';
import Loader from '../../components/common/Loader';
import { getAllCourses } from '../../services/courseService';
import { getMyApplications } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, appsRes] = await Promise.all([
          getAllCourses(),
          getMyApplications()
        ]);
        setCourses(coursesRes.data.slice(0, 3));
        setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2035 0%, #1E3A5F 100%)',
        padding: '32px 20px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: 'clamp(1.4rem, 5vw, 1.6rem)',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '8px',
          letterSpacing: '-0.3px'
        }}>
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: '#B8D0E8',
          maxWidth: '480px',
          margin: '0 auto 24px'
        }}>
          Discover courses and opportunities built for youth in Kakuma.
        </p>
        <Link to="/courses" style={{ display: 'block', maxWidth: '420px', margin: '0 auto' }}>
          <button
            className="fh-mobile-full"
            style={{
              background: '#F5A623',
              color: '#1E3A5F',
              padding: '14px 32px',
              minHeight: '44px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(245, 166, 35, 0.3)'
            }}
          >
            Explore Courses
          </button>
        </Link>
      </div>

      <div className="fh-container">

        {/* Stats */}
        <div className="fh-stats-grid" style={{ marginBottom: '32px' }}>
          {[
            { label: 'Available Courses', value: courses.length },
            { label: 'My Applications', value: applications.length },
            {
              label: 'Shortlisted',
              value: applications.filter(a => a.status === 'shortlisted').length
            },
            {
              label: 'Accepted',
              value: applications.filter(a => a.status === 'accepted').length
            }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '14px',
              padding: '18px 12px',
              textAlign: 'center',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{
                fontSize: '1.9rem',
                fontWeight: 800,
                color: '#F5A623',
                lineHeight: 1.1,
                letterSpacing: '-0.5px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#7A9BB5',
                marginTop: '6px',
                fontWeight: 600
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Latest Courses */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              Latest Courses
            </h2>
            <Link to="/courses" style={{
              fontSize: '0.9rem',
              color: '#F5A623',
              fontWeight: '600'
            }}>
              View all →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="fh-empty">
              <div className="fh-empty-icon">📚</div>
              <p style={{ fontSize: '0.95rem' }}>No courses available yet.</p>
            </div>
          ) : (
            <div className="fh-card-grid">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                My Recent Applications
              </h2>
              <Link to="/applications" style={{
                fontSize: '0.9rem',
                color: '#F5A623',
                fontWeight: '600'
              }}>
                View all →
              </Link>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden'
            }}>
              {applications.slice(0, 3).map((app, i) => (
                <div key={app._id} style={{
                  padding: '16px 20px',
                  borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}>
                      {app.course?.title}
                    </p>
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginTop: '2px'
                    }}>
                      {app.organisation?.name}
                    </p>
                  </div>
                  <span className={`fh-badge fh-badge-${app.status}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;