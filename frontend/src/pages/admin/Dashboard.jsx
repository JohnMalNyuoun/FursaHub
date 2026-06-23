import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
    { label: `Users (${stats?.totalYouth || 0})`, value: stats?.totalYouth, link: '/admin/users' },
    { label: `Organisations (${stats?.totalOrganisations || 0})`, value: stats?.totalOrganisations, link: '/admin/organisations' },
    { label: 'Pending Approval', value: stats?.pendingOrganisations, link: '/admin/organisations?status=pending' },
    { label: 'Total Courses', value: stats?.totalCourses, link: '/admin/courses' },
    { label: 'Published Courses', value: stats?.publishedCourses, link: '/admin/courses?status=published' },
    { label: 'Total Applications', value: stats?.totalApplications, link: '/admin/courses' }
  ];

  const quickActions = [
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
      title: `Youth Profiles (${stats?.totalYouth || 0})`,
      desc: 'View and manage all youth profiles',
      link: '/admin/users',
      urgent: false
    },
    {
      title: `Organisations (${stats?.totalOrganisations || 0})`,
      desc: 'View and manage organisation profiles',
      link: '/admin/organisations',
      urgent: false
    }
  ];

  const q = searchTerm.trim().toLowerCase();
  const filteredStatCards = q
    ? statCards.filter((item) => item.label.toLowerCase().includes(q))
    : statCards;
  const filteredActions = q
    ? quickActions.filter((item) => `${item.title} ${item.desc}`.toLowerCase().includes(q))
    : quickActions;

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search dashboard"
            style={{
              flex: '1 1 260px',
              maxWidth: '420px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1px solid #2A4A6B',
              background: '#10223A',
              color: '#FFFFFF'
            }}
          />
          <button
            type="button"
            onClick={() => setSearchTerm(searchInput)}
            style={{
              background: '#F5A623',
              color: '#1E3A5F',
              border: 'none',
              borderRadius: '999px',
              padding: '10px 14px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Search
          </button>
          <Link
            to="/admin/settings"
            style={{
              color: '#F5A623',
              fontSize: '0.86rem',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            Menu: Settings
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gap: '10px', marginBottom: '28px' }}>
          {filteredStatCards.map((stat, i) => (
            <Link key={i} to={stat.link} style={{ textDecoration: 'none' }}>
              <div style={{
                borderBottom: stat.label === 'Pending Approval' && stats?.pendingOrganisations > 0
                  ? '1px solid #F5A623' : '1px solid #2A4A6B',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer'
              }}>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#F5A623'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.86rem',
                  color: '#B8D0E8',
                  fontWeight: 700,
                  textAlign: 'right'
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

          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredActions.map((action, i) => (
              <Link key={i} to={action.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  borderBottom: `1px solid ${action.urgent ? '#F5A623' : '#2A4A6B'}`,
                  padding: '10px 0',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
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