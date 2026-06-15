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
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#A8CFC0' }}>
            Platform overview and management
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}>
          {statCards.map((stat, i) => (
            <Link key={i} to={stat.link} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                textAlign: 'center',
                boxShadow: 'var(--card-shadow)',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  color: stat.label === 'Pending Approval' && stats?.pendingOrganisations > 0
                    ? '#D69E2E' : 'var(--green-primary)'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '6px'
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
                  background: 'var(--bg-card)',
                  border: `1px solid ${action.urgent ? '#FAD08A' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  background: action.urgent ? '#FFFAF0' : 'var(--bg-card)'
                }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '6px'
                  }}>
                    {action.title}
                    {action.urgent && (
                      <span style={{
                        marginLeft: '8px',
                        background: '#D69E2E',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '20px'
                      }}>
                        Action needed
                      </span>
                    )}
                  </h3>
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)'
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