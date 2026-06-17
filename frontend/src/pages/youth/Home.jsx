import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import CourseCard from '../../components/youth/CourseCard';
import { getAllCourses } from '../../services/courseService';
import { getMyApplications } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';

const statusConfig = {
  submitted: {
    label: 'Submitted',
    color: '#93C5FD',
    bg: 'rgba(59,130,246,0.15)',
    icon: '📝',
    message: 'Your application has been received'
  },
  under_review: {
    label: 'Under Review',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.15)',
    icon: '🔍',
    message: 'The organisation is reviewing your application'
  },
  shortlisted: {
    label: 'Shortlisted',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.2)',
    icon: '🎉',
    message: 'Congratulations! Check your application for interview details'
  },
  accepted: {
    label: 'Accepted',
    color: '#D4891A',
    bg: 'rgba(245,166,35,0.25)',
    icon: '✅',
    message: 'You have been accepted! Well done'
  },
  rejected: {
    label: 'Not Selected',
    color: '#FCA5A5',
    bg: 'rgba(229,62,62,0.15)',
    icon: '💪',
    message: 'Keep applying - the right opportunity is coming'
  },
  withdrawn: {
    label: 'Withdrawn',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.15)',
    icon: '↩️',
    message: 'You withdrew this application'
  }
};

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

  const activeApplications = applications.filter(
    a => !['withdrawn', 'rejected'].includes(a.status)
  );

  const shortlistedApps = applications.filter(
    a => a.status === 'shortlisted'
  );

  const acceptedApps = applications.filter(
    a => a.status === 'accepted'
  );

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(140deg, #0F2035 0%, #1E3A5F 100%)',
        padding: '36px 20px',
        borderBottom: '1px solid #2A4A6B'
      }}>
        <div className="fh-container" style={{ maxWidth: '980px', padding: 0 }}>
          <p style={{
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: '#93C5FD',
            marginBottom: '8px'
          }}>
            Welcome back
          </p>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: '10px'
          }}>
            {user?.fullName?.split(' ')[0]} 👋
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#B8D0E8',
            marginBottom: '20px',
            maxWidth: '620px'
          }}>
            {activeApplications.length > 0
              ? `You have ${activeApplications.length} active application${activeApplications.length !== 1 ? 's' : ''}`
              : 'Discover courses and opportunities in Kakuma'}
          </p>

          <Link to="/courses" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F5A623',
            color: '#1E3A5F',
            padding: '12px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}>
            Explore Courses -&gt;
          </Link>
        </div>
      </section>

      <div className="fh-container" style={{ maxWidth: '980px' }}>
        {/* URGENT - Shortlisted alerts */}
        {shortlistedApps.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            {shortlistedApps.map(app => (
              <div key={app._id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                background: 'linear-gradient(135deg, rgba(245,166,35,0.22), rgba(245,166,35,0.14))',
                border: '1px solid rgba(245,166,35,0.45)',
                borderRadius: '14px',
                padding: '16px 18px',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 800,
                    color: '#FDE68A',
                    fontSize: '0.9rem',
                    marginBottom: '4px'
                  }}>
                    <span>🎉</span>
                    <span>You've been shortlisted</span>
                  </div>
                  <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                    {app.course?.title}
                  </p>
                  <p style={{ color: '#B8D0E8', fontSize: '0.82rem', marginBottom: '2px' }}>
                    {app.organisation?.name}
                  </p>
                  {app.nextStep?.scheduledAt && (
                    <p style={{ color: '#FDE68A', fontSize: '0.8rem', fontWeight: 700 }}>
                      📅 Interview: {new Date(app.nextStep.scheduledAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <Link to="/applications" style={{
                  color: '#1E3A5F',
                  background: '#FDE68A',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  View Details -&gt;
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="fh-stats-grid" style={{ marginBottom: '24px' }}>
          {[
            {
              label: 'Available Courses',
              value: courses.length,
              icon: '📚'
            },
            {
              label: 'My Applications',
              value: applications.length,
              icon: '📋'
            },
            {
              label: 'Shortlisted',
              value: shortlistedApps.length,
              icon: '🎯'
            },
            {
              label: 'Accepted',
              value: acceptedApps.length,
              icon: '✅'
            }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '12px',
              padding: '16px 14px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '1.7rem',
                fontWeight: 900,
                color: '#F5A623',
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#7A9BB5',
                marginTop: '6px',
                fontWeight: 700
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Live Application Status */}
        {applications.length > 0 && (
          <section style={{
            background: '#1A3357',
            border: '1px solid #2A4A6B',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
              <h2 style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#FFFFFF'
              }}>
                Your Applications
              </h2>

              <Link to="/applications" style={{
                fontSize: '0.82rem',
                color: '#F5A623',
                fontWeight: 700
              }}>
                View all -&gt;
              </Link>
            </div>

            <div>
              {applications.slice(0, 4).map(app => {
                const config = statusConfig[app.status] || statusConfig.submitted;
                const daysAgo = Math.floor(
                  (new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={app._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: '#152A47',
                    border: '1px solid #2A4A6B',
                    borderRadius: '12px',
                    padding: '14px 12px',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {config.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {app.course?.title}
                      </p>
                      <p style={{ color: '#7A9BB5', fontSize: '0.78rem', marginBottom: '3px' }}>
                        {app.organisation?.name}
                      </p>
                      <p style={{ color: '#B8D0E8', fontSize: '0.76rem' }}>
                        {config.message}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-block',
                        color: config.color,
                        background: config.bg,
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '5px 8px',
                        borderRadius: '999px',
                        marginBottom: '6px'
                      }}>
                        {config.label}
                      </span>
                      <p style={{ color: '#7A9BB5', fontSize: '0.74rem' }}>
                        {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state - no applications yet */}
        {applications.length === 0 && (
          <section style={{
            background: '#1A3357',
            border: '1px dashed #2A4A6B',
            borderRadius: '14px',
            padding: '28px 18px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
              Start your journey
            </h3>
            <p style={{ color: '#7A9BB5', fontSize: '0.9rem', marginBottom: '16px' }}>
              Browse courses and apply for your first opportunity
            </p>

            <Link to="/courses" style={{
              display: 'inline-block',
              background: '#F5A623',
              color: '#1E3A5F',
              fontWeight: 800,
              fontSize: '0.9rem',
              padding: '10px 14px',
              borderRadius: '10px'
            }}>
              Browse Courses
            </Link>
          </section>
        )}

        {/* Latest Courses */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              Latest Courses
            </h2>
            <Link to="/courses" style={{
              fontSize: '0.9rem',
              color: '#F5A623',
              fontWeight: 600
            }}>
              View all -&gt;
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="fh-empty">
              No courses available yet
            </div>
          ) : (
            <div className="fh-card-grid">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;