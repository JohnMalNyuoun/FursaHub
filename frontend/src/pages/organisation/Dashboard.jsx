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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMetric, setActiveMetric] = useState('');

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
    { label: 'Total Courses', value: courses.length, key: 'total_courses', color: '#F5A623' },
    { label: 'Published', value: courses.filter(c => c.status === 'published').length, key: 'published', color: '#FFD27A' },
    { label: 'Total Applications', value: applications.length, key: 'total_apps', color: '#9DBBE3' },
    { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, key: 'shortlisted', color: '#B8D0E8' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, key: 'accepted', color: '#F5A623' },
    { label: 'Pending Review', value: applications.filter(a => a.status === 'submitted').length, key: 'pending', color: '#7A9BB5' }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = courseFilter === 'all' || course.status === courseFilter;
    return matchesSearch && matchesFilter;
  });

  const funnelStages = [
    { label: 'Published Courses', value: stats[1].value, color: '#F5A623', hint: 'Active course supply' },
    { label: 'Total Applications', value: stats[2].value, color: '#FFD27A', hint: 'Youth engagement' },
    { label: 'Shortlisted', value: stats[3].value, color: '#9DBBE3', hint: 'In review stage' },
    { label: 'Accepted', value: stats[4].value, color: '#B8D0E8', hint: 'Final outcomes' }
  ];

  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;
  const conversionRate = stats[2].value > 0
    ? Math.round((stats[4].value / stats[2].value) * 100)
    : 0;



  return (
    <div style={{ background: 'linear-gradient(180deg, #0D1C31 0%, #10223A 45%, #0F2035 100%)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10223A 0%, #1A3357 60%, #243F66 100%)',
        padding: '36px 20px 40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', color: '#FFD27A', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
            <p style={{ fontSize: '0.95rem', color: '#B8D0E8', margin: 0 }}>
              Manage your courses and review youth applications from one clean workspace.
            </p>
          </div>
          <button
            onClick={() => navigate('/org/analytics')}
            style={{
              background: '#F5A623',
              color: '#1E3A5F',
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

        {/* Top Search */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F5A623', marginBottom: '6px' }}>
            Search
          </label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses or youth"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid #2A4A6B',
              outline: 'none',
              background: '#10223A',
              color: '#FFFFFF'
            }}
          />
        </div>

        {/* Flat metric links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveMetric('registration');
              setCourseFilter('all');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              color: activeMetric === 'registration' ? '#F5A623' : '#B8D0E8',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: activeMetric === 'registration' ? 'underline' : 'none',
              textUnderlineOffset: '4px'
            }}
          >
            Registration Metric: {stats[0].value}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMetric('operational');
              setCourseFilter('published');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              color: activeMetric === 'operational' ? '#FFD27A' : '#B8D0E8',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: activeMetric === 'operational' ? 'underline' : 'none',
              textUnderlineOffset: '4px'
            }}
          >
            Operational Status: {stats[1].value}
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('outcome')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              color: activeMetric === 'outcome' ? '#9DBBE3' : '#B8D0E8',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: activeMetric === 'outcome' ? 'underline' : 'none',
              textUnderlineOffset: '4px'
            }}
          >
            Outcome/Performance: {stats[4].value}
          </button>
        </div>

        {/* Controls Ribbon */}
        {activeMetric === 'registration' && (
        <div style={{
          background: '#152A47',
          border: '1px solid #2A4A6B',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#F5A623', marginBottom: '6px' }}>
              Course Status
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #2A4A6B',
                outline: 'none',
                background: '#10223A',
                color: '#FFFFFF'
              }}
            >
              <option value="all">All courses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        )}

        {/* Workspace */}
        <div>
          {!activeMetric && (
            <div style={{
              color: '#B8D0E8',
              fontSize: '0.92rem',
              border: '1px dashed #2A4A6B',
              borderRadius: '12px',
              padding: '16px'
            }}>
              Select one metric above to view its section.
            </div>
          )}

          <div style={{ display: 'grid', gap: '24px' }}>
            {activeMetric === 'operational' && (
            <div
              style={{
              background: '#152A47',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#F5A623', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Main Component
                  </p>
                  <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.15rem', fontWeight: 800 }}>
                    Course Funnel
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/org/analytics')}
                  style={{
                    background: '#F5A623',
                    color: '#1E3A5F',
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
                    background: index === 0 ? '#1E3A5F' : '#10223A',
                    border: '1px solid #2A4A6B',
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
                        <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.98rem' }}>{stage.label}</div>
                        <div style={{ color: '#B8D0E8', fontSize: '0.8rem' }}>{stage.hint}</div>
                      </div>
                      <div style={{ color: stage.color, fontSize: '1.5rem', fontWeight: 900 }}>{stage.value}</div>
                    </div>
                    <div style={{ height: '10px', borderRadius: '999px', background: '#274868', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max((stage.value / Math.max(stats[2].value, 1)) * 100, 12)}%`, height: '100%', background: `linear-gradient(90deg, ${stage.color}, #FFE2A7)`, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeMetric === 'registration' && (
            <div
              style={{
              background: '#152A47',
              border: '1px solid #2A4A6B',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Posted Courses
                </h2>
                <Link to="/org/courses" style={{ color: '#F5A623', fontWeight: 700, textDecoration: 'none' }}>
                  View all →
                </Link>
              </div>

              <div style={{
                border: '1px solid #2A4A6B',
                borderRadius: '14px',
                padding: '20px',
                display: 'grid',
                gap: '12px'
              }}>
                <p style={{ color: '#B8D0E8', margin: 0, fontSize: '0.9rem' }}>
                  Number of courses posted
                </p>
                <p style={{ color: '#F5A623', margin: 0, fontSize: '2rem', fontWeight: 900 }}>
                  {filteredCourses.length}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link to="/org/courses" style={{ color: '#F5A623', fontWeight: 700, textDecoration: 'none' }}>
                    View Courses
                  </Link>
                  <Link to="/org/courses/new" style={{ color: '#B8D0E8', fontWeight: 700, textDecoration: 'none' }}>
                    Post New
                  </Link>
                </div>
              </div>
            </div>
            )}

            {activeMetric === 'outcome' && (
              <div style={{
                background: '#152A47',
                border: '1px solid #2A4A6B',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)'
              }}>
                <h2 style={{ margin: '0 0 12px 0', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800 }}>
                  Outcome Summary
                </h2>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    ['Accepted', stats[4].value],
                    ['Shortlisted', stats[3].value],
                    ['Rejected', rejectedCount],
                    ['Pending Review', stats[5].value],
                    ['Acceptance Rate', `${conversionRate}%`]
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '12px' }}>
                      <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
                      <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.88rem' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;