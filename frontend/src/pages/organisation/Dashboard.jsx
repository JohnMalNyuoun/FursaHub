import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgCourses } from '../../services/courseService';
import { getOrgApplications } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
    { label: 'Total Courses', value: courses.length, key: 'total_courses', color: '#2F6B3E' },
    { label: 'Published', value: courses.filter(c => c.status === 'published').length, key: 'published', color: '#4F8F5B' },
    { label: 'Total Applications', value: applications.length, key: 'total_apps', color: '#6CA96D' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, key: 'shortlisted', color: '#7BAA7D' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, key: 'accepted', color: '#2F6B3E' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'submitted').length, key: 'pending', color: '#A7CFA8' }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = courseFilter === 'all' || course.status === courseFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredApplications = applications.filter((application) => {
    const matchesSearch = application.youth?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      || application.course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = applicationFilter === 'all' || application.status === applicationFilter;
    return matchesSearch && matchesFilter;
  });

  const funnelStages = [
    { label: 'Published Courses', value: stats[1].value, color: '#2F6B3E', hint: 'Active course supply' },
    { label: 'Total Applications', value: stats[2].value, color: '#4F8F5B', hint: 'Youth engagement' },
    { label: 'Shortlisted', value: stats[3].value, color: '#7BAA7D', hint: 'In review stage' },
    { label: 'Accepted', value: stats[4].value, color: '#A7CFA8', hint: 'Final outcomes' }
  ];



  return (
    <div style={{ background: 'linear-gradient(180deg, #F6FBF7 0%, #FFFFFF 30%, #F4FAF5 100%)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E5D34 0%, #2F6B3E 100%)',
        padding: '36px 20px 40px',
        boxShadow: '0 10px 30px rgba(47, 107, 62, 0.14)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', color: '#DDF2E0', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Organisation Dashboard
            </p>
            <h1 style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.1rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '6px',
              letterSpacing: '-0.3px'
            }}>
              Welcome, {user?.name} 👋
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#EAF7EB', margin: 0 }}>
              Manage your courses and review youth applications from one clean workspace.
            </p>
          </div>
          <button
            onClick={() => navigate('/org/analytics')}
            style={{
              background: '#FFFFFF',
              color: '#1E5D34',
              border: 'none',
              borderRadius: '999px',
              padding: '12px 18px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
            }}
          >
            Open Course Analytics
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 40px' }}>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {[
            { title: 'Registration Metric', value: stats[0].value, note: 'Total courses created', color: '#2F6B3E' },
            { title: 'Operational Status', value: stats[1].value, note: 'Published and active', color: '#4F8F5B' },
            { title: 'Outcome/Performance', value: stats[4].value, note: 'Accepted youth outcomes', color: '#7BAA7D' }
          ].map((card, index) => (
            <div key={index} style={{
              background: '#FFFFFF',
              border: '1px solid #DDEBDD',
              borderRadius: '18px',
              padding: '20px',
              boxShadow: '0 10px 24px rgba(22, 68, 32, 0.06)'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: card.color }}>
                {card.title}
              </p>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#17361F', lineHeight: 1, marginBottom: '8px' }}>
                {card.value}
              </div>
              <p style={{ margin: 0, color: '#5E7564', fontSize: '0.9rem' }}>
                {card.note}
              </p>
            </div>
          ))}
        </div>

        {/* Controls Ribbon */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #DDEBDD',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: '0 10px 24px rgba(22, 68, 32, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#2F6B3E', marginBottom: '6px' }}>
              Search
            </label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses or youth"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #CFE3D1',
                outline: 'none',
                background: '#FBFFFC'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#2F6B3E', marginBottom: '6px' }}>
              Course Status
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #CFE3D1',
                outline: 'none',
                background: '#FBFFFC'
              }}
            >
              <option value="all">All courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#2F6B3E', marginBottom: '6px' }}>
              Application Status
            </label>
            <select
              value={applicationFilter}
              onChange={(e) => setApplicationFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #CFE3D1',
                outline: 'none',
                background: '#FBFFFC'
              }}
            >
              <option value="all">All applications</option>
              <option value="submitted">Pending review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '24px',
          alignItems: 'start'
        }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #DDEBDD',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 10px 24px rgba(22, 68, 32, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#2F6B3E', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Main Component
                  </p>
                  <h2 style={{ margin: 0, color: '#17361F', fontSize: '1.15rem', fontWeight: 800 }}>
                    Course Funnel
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/org/analytics')}
                  style={{
                    background: '#2F6B3E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 14px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  View analytics
                </button>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {funnelStages.map((stage, index) => (
                  <div key={stage.label} style={{
                    position: 'relative',
                    background: index === 0 ? '#F3FBF4' : '#FBFFFC',
                    border: '1px solid #D8E8D9',
                    borderRadius: '14px',
                    padding: '16px 18px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '10px'
                    }}>
                      <div>
                        <div style={{ color: '#17361F', fontWeight: 800, fontSize: '0.98rem' }}>{stage.label}</div>
                        <div style={{ color: '#6B8170', fontSize: '0.8rem' }}>{stage.hint}</div>
                      </div>
                      <div style={{ color: stage.color, fontSize: '1.5rem', fontWeight: 900 }}>{stage.value}</div>
                    </div>
                    <div style={{ height: '10px', borderRadius: '999px', background: '#E5F0E6', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max((stage.value / Math.max(stats[2].value, 1)) * 100, 12)}%`, height: '100%', background: `linear-gradient(90deg, ${stage.color}, #9BC79E)`, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid #DDEBDD',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 10px 24px rgba(22, 68, 32, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#17361F' }}>
                  Your Courses
                </h2>
                <Link to="/org/courses" style={{ color: '#2F6B3E', fontWeight: 700, textDecoration: 'none' }}>
                  View all →
                </Link>
              </div>

              {filteredCourses.length === 0 ? (
                <div style={{
                  background: '#F7FBF7',
                  border: '1px dashed #CFE3D1',
                  borderRadius: '14px',
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#6B8170', marginBottom: '16px' }}>
                    You haven't posted any matching courses yet
                  </p>
                  <Link to="/org/courses/new">
                    <button style={{
                      background: '#2F6B3E',
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '999px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Post Your First Course
                    </button>
                  </Link>
                </div>
              ) : (
                <div style={{ border: '1px solid #E1EEE2', borderRadius: '14px', overflow: 'hidden' }}>
                  {filteredCourses.slice(0, 5).map((course, i) => (
                    <div key={course._id} style={{
                      padding: '16px 18px',
                      borderBottom: i < Math.min(filteredCourses.length, 5) - 1 ? '1px solid #E9F2EA' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#17361F', fontSize: '0.95rem', marginBottom: '2px' }}>
                          {course.title}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#6B8170', margin: 0 }}>
                          {course.filledSlots}/{course.totalSlots} slots filled
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: course.status === 'published' ? '#E7F5E9' : '#F3F6F3',
                        color: course.status === 'published' ? '#2F6B3E' : '#5F7264',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'capitalize'
                      }}>
                        {course.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #DDEBDD',
            borderRadius: '18px',
            padding: '24px',
            boxShadow: '0 10px 24px rgba(22, 68, 32, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <p style={{ margin: '0 0 6px 0', color: '#2F6B3E', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Secondary Component
                </p>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#17361F' }}>
                  Recent Applications
                </h2>
              </div>
              <Link to="/org/applications" style={{ color: '#2F6B3E', fontWeight: 700, textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            {filteredApplications.length === 0 ? (
              <div style={{
                background: '#F7FBF7',
                border: '1px dashed #CFE3D1',
                borderRadius: '14px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#6B8170', fontSize: '0.9rem', margin: 0 }}>
                  No matching applications received yet.
                </p>
              </div>
            ) : (
              <div style={{ border: '1px solid #E1EEE2', borderRadius: '14px', overflow: 'hidden' }}>
                {filteredApplications.slice(0, 5).map((app, i) => (
                  <div key={app._id} style={{
                    padding: '16px 18px',
                    borderBottom: i < Math.min(filteredApplications.length, 5) - 1 ? '1px solid #E9F2EA' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {app.youth?.photo ? (
                        <img
                          src={app.youth.photo}
                          alt={app.youth?.fullName || 'Youth'}
                          style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: '#E7F5E9',
                          color: '#2F6B3E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem'
                        }}>
                          {(app.youth?.fullName || 'Y').charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p style={{ fontWeight: 700, color: '#17361F', fontSize: '0.95rem', marginBottom: '2px' }}>
                          <Link
                            to={`/profiles/youth/${app.youth?._id}`}
                            style={{ color: '#17361F', textDecoration: 'none' }}
                          >
                            {app.youth?.fullName}
                          </Link>
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#6B8170', margin: 0 }}>
                          {app.course?.title}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '6px 10px',
                      borderRadius: '999px',
                      background: app.status === 'accepted' ? '#E7F5E9' : app.status === 'shortlisted' ? '#F1F8F2' : '#F6FAF6',
                      color: app.status === 'accepted' ? '#2F6B3E' : app.status === 'shortlisted' ? '#4F8F5B' : '#5F7264',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'capitalize'
                    }}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;