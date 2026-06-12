import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from './Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (user?.role === 'organisation') {
      navigate('/org/login');
    } else {
      navigate('/login');
    }
  };

  const youthLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Courses', path: '/courses' },
    { label: 'Applications', path: '/applications' },
    { label: 'Notifications', path: '/notifications' }
  ];

  const orgLinks = [
    { label: 'Dashboard', path: '/org/dashboard' },
    { label: 'Courses', path: '/org/courses' },
    { label: 'Applications', path: '/org/applications' }
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Organisations', path: '/admin/organisations' },
    { label: 'Courses', path: '/admin/courses' },
    { label: 'Users', path: '/admin/users' }
  ];

  const links = user?.role === 'organisation'
    ? orgLinks
    : user?.role === 'admin'
    ? adminLinks
    : youthLinks;

  return (
    <nav style={{
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--card-shadow)'
    }}>
      {/* Logo */}
      <Link to={
        user?.role === 'organisation' ? '/org/dashboard' :
        user?.role === 'admin' ? '/admin/dashboard' : '/home'
      }>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: '800',
          color: 'var(--green-primary)'
        }}>
          FursaHub
        </span>
      </Link>

      {/* Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px'
      }}>
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              transition: 'var(--transition)'
            }}
          >
            {link.label}
          </Link>
        ))}

        <Button
          variant="outline"
          onClick={handleLogout}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;