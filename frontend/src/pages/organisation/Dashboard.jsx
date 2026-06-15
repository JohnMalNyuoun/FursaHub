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
        background: 'var(--green-deep)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '4px'
          }}>
            Welcome, {user?.name} 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#A8CFC0' }}>
            Manage your courses and applications from here
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              textAlign: 'center',
              boxShadow: 'var(--card-shadow)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: 'var(--green-primary)'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: '4px'
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
              color: 'var(--green-primary)',
              fontWeight: '600'
            }}>
              View all →
            </Link>
          </div>

          {courses.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '40px',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                You haven't posted any courses yet
              </p>
              <Link to="/org/courses/new">
                <button style={{
                  background: 'var(--green-primary)',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
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
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    background: course.status === 'published'
                      ? '#F0FFF4' : course.status === 'closed'
                      ? '#FFF5F5' : 'var(--bg-section-alt)',
                    color: course.status === 'published'
                      ? '#276749' : course.status === 'closed'
                      ? '#C53030' : 'var(--text-secondary)'
                  }}>
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
              color: 'var(--green-primary)',
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
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    background: app.status === 'shortlisted' || app.status === 'accepted'
                      ? '#F0FFF4' : app.status === 'rejected'
                      ? '#FFF5F5' : '#EBF8FF',
                    color: app.status === 'shortlisted' || app.status === 'accepted'
                      ? '#276749' : app.status === 'rejected'
                      ? '#C53030' : '#2C5282'
                  }}>
                    {app.status}
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