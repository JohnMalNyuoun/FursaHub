import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../../services/notificationService';
import { useNotifications } from '../../context/NotificationContext';
import { checkFollowStatus, followTarget } from '../../services/followService';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStatusByUser, setFollowStatusByUser] = useState({});
  const [followLoadingByUser, setFollowLoadingByUser] = useState({});
  const { resetUnreadCount } = useNotifications();

  const loadFollowStatus = async (notificationList) => {
    const followerIds = [...new Set(
      notificationList
        .filter((item) => item.type === 'new_follower' && item.referenceModel === 'User' && item.reference)
        .map((item) => String(item.reference))
    )];

    if (followerIds.length === 0) {
      setFollowStatusByUser({});
      return;
    }

    const entries = await Promise.all(
      followerIds.map(async (userId) => {
        try {
          const res = await checkFollowStatus(userId, 'User');
          const isFollowing = Boolean(res?.data?.data?.isFollowing);
          return [userId, isFollowing];
        } catch {
          return [userId, false];
        }
      })
    );

    setFollowStatusByUser(Object.fromEntries(entries));
  };

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
      await loadFollowStatus(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    resetUnreadCount();
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

  const handleFollowBack = async (followerId) => {
    setFollowLoadingByUser((prev) => ({ ...prev, [followerId]: true }));
    try {
      await followTarget(followerId, 'User');
      setFollowStatusByUser((prev) => ({ ...prev, [followerId]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoadingByUser((prev) => ({ ...prev, [followerId]: false }));
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Back */}
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
        {/* Header */}
        <div style={{ padding: '20px 0 4px', borderBottom: '1px solid #2A4A6B', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
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
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              title="Mark all as read"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: unreadCount === 0 ? 'default' : 'pointer',
                padding: '4px',
                color: unreadCount === 0 ? '#2A4A6B' : '#F5A623',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="fh-empty">
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div>
            {notifications.map((notification, i) => (
              <div
                key={notification._id}
                onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                style={{
                  padding: '16px 0',
                  borderBottom: i < notifications.length - 1
                    ? '1px solid #2A4A6B' : 'none',
                  background: 'transparent',
                  cursor: notification.isRead ? 'default' : 'pointer',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {(() => {
                    const s = notification.sender;
                    const imgSrc = s?.logo || s?.photo || null;
                    const initial = s?.name?.[0] || s?.fullName?.[0] || '?';
                    return imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={s?.name || s?.fullName || ''}
                        style={{
                          width: '40px', height: '40px',
                          borderRadius: '50%', objectFit: 'cover',
                          border: '1px solid #2A4A6B'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '50%',
                        background: '#1A3357',
                        border: '1px solid #2A4A6B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 800, color: '#F5A623',
                        textTransform: 'uppercase'
                      }}>
                        {initial}
                      </div>
                    );
                  })()}
                </div>

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

                  {notification.type === 'new_follower' && notification.referenceModel === 'User' && notification.reference && (
                    <div style={{ marginTop: '10px' }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!notification.isRead) {
                            handleMarkAsRead(notification._id);
                          }
                          handleFollowBack(String(notification.reference));
                        }}
                        disabled={Boolean(followLoadingByUser[String(notification.reference)]) || Boolean(followStatusByUser[String(notification.reference)])}
                        style={{
                          minHeight: '36px',
                          padding: '8px 12px',
                          fontSize: '0.78rem'
                        }}
                      >
                        {followStatusByUser[String(notification.reference)]
                          ? 'Following'
                          : followLoadingByUser[String(notification.reference)]
                            ? 'Following...'
                            : 'Follow back'}
                      </Button>
                    </div>
                  )}
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
