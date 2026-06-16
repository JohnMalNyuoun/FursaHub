import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgCourses } from '../../services/courseService';
import { getOrgApplications } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, appsRes] = await Promise.all([
          getOrgCourses(),
          getOrgApplications()
        ]);
        setCourses(coursesRes.data);
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

  const stats = [
    { label: 'Total Courses', value: courses.length },
    { label: 'Published', value: courses.filter(c => c.status === 'published').length },
    { label: 'Total Applications', value: applications.length },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'submitted').length }
  ];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2035 0%, #1E3A5F 100%)',
        padding: '32px 20px 36px'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 5vw, 1.6rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '6px',
            letterSpacing: '-0.3px'
          }}>
            Welcome, {user?.name} 👋
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#B8D0E8' }}>
            Manage your courses and applications from here
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 40px' }}>

        {/* Stats */}
        <div className="fh-stats-grid fh-stats-6" style={{ marginBottom: '32px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '14px',
              padding: '18px 12px',
              textAlign: 'center',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#F5A623',
                lineHeight: 1.1,
                letterSpacing: '-0.5px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.76rem',
                color: '#7A9BB5',
                marginTop: '6px',
                fontWeight: 600
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Courses */}
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
              Your Courses
            </h2>
            <Link to="/org/courses" style={{
              fontSize: '0.9rem',
              color: '#F5A623',
              fontWeight: '600'
            }}>
              View all →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px dashed #2A4A6B',
              borderRadius: 'var(--radius)',
              padding: '40px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#7A9BB5', marginBottom: '16px' }}>
                You haven't posted any courses yet
              </p>
              <Link to="/org/courses/new">
                <button style={{
                  background: '#F5A623',
                  color: '#1E3A5F',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius)',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Post Your First Course
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden'
            }}>
              {courses.slice(0, 5).map((course, i) => (
                <div key={course._id} style={{
                  padding: '16px 20px',
                  borderBottom: i < courses.length - 1
                    ? '1px solid var(--border-color)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      marginBottom: '2px'
                    }}>
                      {course.title}
                    </p>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      {course.filledSlots}/{course.totalSlots} slots filled
                    </p>
                  </div>
                  <span className={`fh-badge fh-badge-${course.status}`}>
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
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
              Recent Applications
            </h2>
            <Link to="/org/applications" style={{
              fontSize: '0.9rem',
              color: '#F5A623',
              fontWeight: '600'
            }}>
              View all →
            </Link>
          </div>

          {applications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No applications received yet.
            </p>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden'
            }}>
              {applications.slice(0, 5).map((app, i) => (
                <div key={app._id} style={{
                  padding: '16px 20px',
                  borderBottom: i < 4 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <p style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      marginBottom: '2px'
                    }}>
                      {app.youth?.fullName}
                    </p>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}>
                      {app.course?.title}
                    </p>
                  </div>
                  <span className={`fh-badge fh-badge-${app.status}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;