import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/courses/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Youth', value: stats?.totalYouth, link: '/admin/users' },
    { label: 'Approved Organisations', value: stats?.totalOrganisations, link: '/admin/organisations' },
    { label: 'Pending Approval', value: stats?.pendingOrganisations, link: '/admin/organisations?status=pending' },
    { label: 'Total Courses', value: stats?.totalCourses, link: '/admin/courses' },
    { label: 'Published Courses', value: stats?.publishedCourses, link: '/admin/courses?status=published' },
    { label: 'Total Applications', value: stats?.totalApplications, link: '/admin/courses' }
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
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#B8D0E8' }}>
            Platform overview and management
          </p>
        </div>
      </div>

      <div className="fh-container">

        {/* Stats */}
        <div className="fh-stats-grid fh-stats-6" style={{ marginBottom: '32px' }}>
          {statCards.map((stat, i) => (
            <Link key={i} to={stat.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#1A3357',
                border: stat.label === 'Pending Approval' && stats?.pendingOrganisations > 0
                  ? '1px solid #F5A623' : '1px solid #2A4A6B',
                borderRadius: '14px',
                padding: '20px 12px',
                textAlign: 'center',
                boxShadow: 'var(--card-shadow)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: '#F5A623'
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
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Quick Actions
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                title: 'Review Organisations',
                desc: 'Approve or reject pending organisations',
                link: '/admin/organisations',
                urgent: stats?.pendingOrganisations > 0
              },
              {
                title: 'Monitor Courses',
                desc: 'View and manage all posted courses',
                link: '/admin/courses',
                urgent: false
              },
              {
                title: 'Manage Users',
                desc: 'View and manage all youth accounts',
                link: '/admin/users',
                urgent: false
              }
            ].map((action, i) => (
              <Link key={i} to={action.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: `1px solid ${action.urgent ? '#F5A623' : '#2A4A6B'}`,
                  borderRadius: 'var(--radius)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  background: action.urgent ? 'rgba(245,166,35,0.08)' : '#1A3357'
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '6px'
                  }}>
                    {action.title}
                    {action.urgent && (
                      <span style={{
                        marginLeft: '8px',
                        background: '#F5A623',
                        color: '#1E3A5F',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '20px'
                      }}>
                        Action needed
                      </span>
                    )}
                  </h3>
                  <p style={{
                    fontSize: '0.82rem',
                    color: '#7A9BB5'
                  }}>
                    {action.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;