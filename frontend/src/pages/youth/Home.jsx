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
        background: 'var(--green-deep)',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '12px'
        }}>
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#A8CFC0',
          maxWidth: '480px',
          margin: '0 auto 24px'
        }}>
          Discover courses and opportunities built for youth in Kakuma.
        </p>
        <Link to="/courses">
          <button style={{
            background: 'var(--green-primary)',
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: 'var(--radius)',
            fontWeight: '700',
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer'
          }}>
            Explore Courses
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
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
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                marginTop: '4px'
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
              color: 'var(--green-primary)',
              fontWeight: '600'
            }}>
              View all →
            </Link>
          </div>

          {courses.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No courses available yet.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
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
                color: 'var(--green-primary)',
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
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: app.status === 'shortlisted' || app.status === 'accepted'
                      ? '#F0FFF4' : app.status === 'rejected'
                      ? '#FFF5F5' : 'var(--bg-section-alt)',
                    color: app.status === 'shortlisted' || app.status === 'accepted'
                      ? '#276749' : app.status === 'rejected'
                      ? '#C53030' : 'var(--text-secondary)'
                  }}>
                    {app.status}
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