import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../../services/notificationService';

const notificationIcons = {
  application_submitted: '📝',
  application_shortlisted: '🎉',
  application_accepted: '✅',
  application_rejected: '❌',
  course_published: '📢',
  org_approved: '✅',
  org_rejected: '❌'
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
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
      await markAsRead(id);
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div className="fh-section-head">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '4px'
            }}>
              Notifications
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
              {unreadCount > 0 ? (
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
              ) : null}
              {unreadCount > 0 ? 'unread' : 'All caught up'}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              style={{ fontSize: '0.82rem', padding: '10px 16px', minHeight: '44px' }}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="fh-container" style={{ maxWidth: '720px' }}>
        {notifications.length === 0 ? (
          <div className="fh-empty">
            <div className="fh-empty-icon">🔔</div>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div style={{
            background: '#1A3357',
            border: '1px solid #2A4A6B',
            borderRadius: 'var(--radius)',
            overflow: 'hidden'
          }}>
            {notifications.map((notification, i) => (
              <div
                key={notification._id}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                style={{
                  padding: '20px 24px',
                  borderBottom: i < notifications.length - 1
                    ? '1px solid #2A4A6B' : 'none',
                  background: notification.isRead
                    ? '#1A3357' : '#152A47',
                  cursor: notification.isRead ? 'default' : 'pointer',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>
                  {notificationIcons[notification.type] || '🔔'}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <p style={{
                      fontSize: '0.95rem',
                      fontWeight: notification.isRead ? '500' : '800',
                      color: notification.isRead ? '#B8D0E8' : '#FFFFFF',
                      marginBottom: '4px'
                    }}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
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
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#7A9BB5',
                    marginBottom: '6px',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#7A9BB5' }}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
