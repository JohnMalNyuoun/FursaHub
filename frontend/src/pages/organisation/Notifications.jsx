import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgNotifications } from '../../services/notificationService';
import api from '../../services/api';

const OrgNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getOrgNotifications();
      setNotifications(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/org/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '14px 20px 0' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#B8D0E8',
            fontSize: '0.9rem',
            fontWeight: 700,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: '#F5A623', fontSize: '1rem', lineHeight: 1 }}>←</span>
          <span>Back</span>
        </button>
      </div>

      <div className="fh-container" style={{ maxWidth: '720px' }}>
        <div style={{ padding: '20px 0 4px', borderBottom: '1px solid #2A4A6B', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
              <span style={{
                display: 'inline-block',
                background: '#F5A623',
                color: '#1E3A5F',
                fontWeight: 800,
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                marginRight: '6px'
              }}>
                {unreadCount}
              </span>
              unread
            </p>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="fh-empty">
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((n, i) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                style={{
                  padding: '16px 0',
                  borderBottom: i < notifications.length - 1 ? '1px solid #2A4A6B' : 'none',
                  cursor: n.isRead ? 'default' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: n.isRead ? 500 : 800,
                    color: n.isRead ? '#B8D0E8' : '#FFFFFF',
                    marginBottom: '4px'
                  }}>
                    {n.title}
                  </p>
                  {!n.isRead && (
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#F5A623',
                      flexShrink: 0,
                      marginTop: '6px',
                      boxShadow: '0 0 0 3px rgba(245, 166, 35, 0.2)'
                    }} />
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#7A9BB5', marginBottom: '6px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {n.message}
                </p>
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.title}
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      marginBottom: '8px',
                      maxWidth: '100%',
                      maxHeight: '240px',
                      borderRadius: '10px',
                      border: '1px solid #2A4A6B'
                    }}
                  />
                )}
                <p style={{ fontSize: '0.78rem', color: '#7A9BB5' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgNotifications;
