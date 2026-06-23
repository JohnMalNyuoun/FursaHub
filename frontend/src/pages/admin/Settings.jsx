import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import useAuth from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const SETTINGS_KEY = 'fh_settings_admin_tab';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language,
    alerts: {
      orgRequests: true,
      systemUpdates: true
    }
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(SETTINGS_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setSettings((current) => ({
        ...current,
        ...parsed,
        alerts: {
          ...current.alerts,
          ...(parsed.alerts || {})
        }
      }));
    } catch (err) {
      console.error('Failed to parse admin settings', err);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  const toggleAlert = (key) => {
    setSettings((current) => ({
      ...current,
      alerts: {
        ...current.alerts,
        [key]: !current.alerts[key]
      }
    }));
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Do you want to log out?');
    if (!confirmed) return;
    logout();
    navigate('/login');
  };

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F5A623',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
              marginBottom: '6px'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Admin controls and preferences.
          </p>
        </div>
      </div>

      <div className="fh-container" style={{ display: 'grid', gap: '16px' }}>
        {notice && (
          <div style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid #10B981',
            borderRadius: '12px',
            padding: '12px',
            color: '#A7F3D0'
          }}>
            {notice}
          </div>
        )}

        <section style={{ padding: 0 }}>
          <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
            {user?.fullName || 'Admin User'}
          </p>
          <p style={{ color: '#7A9BB5', fontSize: '0.84rem', marginTop: '4px' }}>
            {user?.email || 'Administrator'}
          </p>
        </section>

        <section style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, margin: 0 }}>
              {settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSettings((current) => ({
                  ...current,
                  theme: current.theme === 'dark' ? 'light' : 'dark'
                }));
                setNotice('Theme updated.');
              }}
              role="switch"
              aria-checked={settings.theme === 'dark'}
              aria-label="Switch theme"
              style={{
                width: '44px',
                height: '24px',
                borderRadius: '999px',
                border: 'none',
                background: settings.theme === 'dark' ? '#F5A623' : '#7A9BB5',
                padding: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: settings.theme === 'dark' ? 'flex-end' : 'flex-start'
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'block'
                }}
              />
            </button>
          </div>
        </section>

        <section style={{ padding: 0 }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label htmlFor="admin-language" style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800 }}>
              Language
            </label>
            <select
              id="admin-language"
              value={settings.language}
              onChange={(e) => {
                const lang = e.target.value;
                setSettings((current) => ({ ...current, language: lang }));
                setLanguage(lang);
                setNotice('Language updated.');
              }}
              style={{
                width: '220px',
                padding: '10px 12px',
                background: '#1A3357',
                color: '#FFFFFF',
                border: '1px solid #2A4A6B',
                borderRadius: '10px'
              }}
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </section>

        <section style={{ padding: 0 }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>
            Notifications
          </h2>
          <div style={{ display: 'grid', gap: '8px' }}>
            <label style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.alerts.orgRequests}
                onChange={() => toggleAlert('orgRequests')}
              />
              Pending organisation requests
            </label>
            <label style={{ color: '#FFFFFF', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.alerts.systemUpdates}
                onChange={() => toggleAlert('systemUpdates')}
              />
              System updates
            </label>
          </div>
        </section>

        <section style={{ padding: 0 }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>
            Shortcuts
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/admin/organisations" style={{ color: '#F5A623', fontSize: '0.86rem', fontWeight: 800, textDecoration: 'none' }}>
              Organisations
            </Link>
            <Link to="/admin/courses" style={{ color: '#F5A623', fontSize: '0.86rem', fontWeight: 800, textDecoration: 'none' }}>
              Courses
            </Link>
            <Link to="/admin/users" style={{ color: '#F5A623', fontSize: '0.86rem', fontWeight: 800, textDecoration: 'none' }}>
              Users
            </Link>
          </div>
        </section>

        <section style={{ padding: 0 }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #E53E3E',
              background: 'rgba(229,62,62,0.12)',
              color: '#FCA5A5',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
