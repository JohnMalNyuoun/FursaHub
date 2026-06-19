import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import * as followService from '../../services/followService';
import useAuth from '../../hooks/useAuth';

const PublicYouthProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/youth/${id}`);
        setProfile(res.data.data);

        const countRes = await followService.getFollowCount(id, 'User');
        setFollowerCount(countRes.data.data.count);

        if (user && user.id !== id) {
          const statusRes = await followService.checkFollowStatus(id, 'User');
          setIsFollowing(statusRes.data.data.isFollowing);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user]);

  const initials = useMemo(() => {
    const name = profile?.fullName || '';
    return (
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'YU'
    );
  }, [profile]);

  const handleFollowClick = async () => {
    if (!user) {
      setError('Please log in to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollowTarget(id, 'User');
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        await followService.followTarget(id, 'User');
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            Youth Profile
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Public profile information
          </p>
        </div>
      </div>

      <div className="fh-container">
        {error ? (
          <div
            style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid #E53E3E',
              borderRadius: '12px',
              padding: '12px',
              color: '#FCA5A5'
            }}
          >
            {error}
          </div>
        ) : (
          <div
            style={{
              background: '#1A3357',
              border: '1px solid #2A4A6B',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                title="Toggle profile details"
              >
                {profile?.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.fullName}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: '#F5A623',
                      color: '#1E3A5F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1rem'
                    }}
                  >
                    {initials}
                  </div>
                )}

                <div style={{ textAlign: 'left' }}>
                  <h2 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px' }}>
                    {profile?.fullName}
                  </h2>
                  <p style={{ color: '#B8D0E8', fontSize: '0.82rem', marginBottom: '2px' }}>
                    @{profile?.username || 'username_not_set'}
                  </p>
                  <p style={{ color: '#F5A623', fontSize: '0.78rem', fontWeight: 700 }}>
                    {showDetails ? 'Hide Details' : 'View Profile Details'}
                  </p>
                </div>
              </button>

              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block', marginBottom: '8px' }}>
                  <strong style={{ color: '#FFFFFF' }}>{followerCount}</strong> followers
                </span>
                {user && user.id !== id && (
                  <button
                    onClick={handleFollowClick}
                    disabled={followLoading}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: isFollowing ? '1px solid #4A9EFF' : 'none',
                      background: isFollowing ? 'transparent' : '#4A9EFF',
                      color: isFollowing ? '#4A9EFF' : '#1A3357',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: followLoading ? 'not-allowed' : 'pointer',
                      opacity: followLoading ? 0.6 : 1,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {showDetails && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2A4A6B' }}>
                <p style={{ color: '#B8D0E8', fontSize: '0.92rem', marginBottom: '16px' }}>
                  {profile?.bio || 'No bio provided.'}
                </p>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {[
                    ['Community', profile?.communityType?.replace('_', ' ') || 'N/A'],
                    ['Age', profile?.age || 'N/A'],
                    ['Gender', profile?.gender || 'N/A'],
                    ['Language', profile?.language || 'N/A']
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                      <span style={{ color: '#7A9BB5', fontWeight: 700, fontSize: '0.84rem' }}>{label}</span>
                      <span style={{ color: '#FFFFFF', fontSize: '0.88rem', textTransform: 'capitalize' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicYouthProfile;
