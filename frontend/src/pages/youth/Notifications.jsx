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
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '4px'
            }}>
              Notifications
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {notifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '1.1rem' }}>No notifications yet</p>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
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
                    ? '1px solid var(--border-color)' : 'none',
                  background: notification.isRead
                    ? 'var(--bg-card)' : 'var(--bg-section-alt)',
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
                      fontWeight: notification.isRead ? '500' : '700',
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--green-primary)',
                        flexShrink: 0,
                        marginTop: '6px'
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
