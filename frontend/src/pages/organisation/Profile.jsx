import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getOrgProfile, updateOrgLogo, updateOrgProfile } from '../../services/profileService';
import * as followService from '../../services/followService';
import { useLanguage } from '../../hooks/useLanguage';

const CLOUDINARY_CLOUD_NAME = 'dkxjwhxne';
const CLOUDINARY_PROFILE_PRESET = 'Fursahub-profile';
const CLOUDINARY_PROFILE_PRESET_FALLBACK = 'fursahub-courses';

const OrgProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersTotal, setFollowersTotal] = useState(0);
  const [followingTotal, setFollowingTotal] = useState(0);
  const logoInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    bio: '',
    phoneNumber: '',
    location: '',
    website: ''
  });
  const { t } = useLanguage();

  const logoSrc = useMemo(() => {
    if (!profile?.logo) return '';
    const version = profile?.updatedAt ? encodeURIComponent(profile.updatedAt) : '';
    if (!version) return profile.logo;
    const separator = profile.logo.includes('?') ? '&' : '?';
    return `${profile.logo}${separator}v=${version}`;
  }, [profile?.logo, profile?.updatedAt]);

  const orgHandle = useMemo(() => {
    const raw = (profile?.name || 'organisation').trim().toLowerCase();
    if (!raw) return 'organisation';
    return raw.replace(/[^a-z0-9\s_]/g, '').replace(/\s+/g, '_');
  }, [profile?.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getOrgProfile();
        setProfile(res.data);
        setForm({
          name: res.data?.name || '',
          description: res.data?.description || '',
          bio: res.data?.bio || '',
          phoneNumber: res.data?.phoneNumber || '',
          location: res.data?.location || '',
          website: res.data?.website || ''
        });

        const orgId = res.data?._id || res.data?.id;
        if (orgId) {
          const [followersRes, followingRes] = await Promise.all([
            followService.getFollowers(orgId, 'Organisation', 6, 0),
            followService.getFollowing(orgId, 6, 0)
          ]);

          setFollowers(followersRes?.data?.data?.followers || []);
          setFollowersTotal(followersRes?.data?.data?.total || 0);

          const followingItems = followingRes?.data?.data?.following || [];
          setFollowing(followingItems.map((item) => item?.following).filter(Boolean));
          setFollowingTotal(followingRes?.data?.data?.total || 0);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    setPhotoFailed(false);
  }, [profile?.logo]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancelEdit = () => {
    setForm({
      name: profile?.name || '',
      description: profile?.description || '',
      bio: profile?.bio || '',
      phoneNumber: profile?.phoneNumber || '',
      location: profile?.location || '',
      website: profile?.website || ''
    });
    setError('');
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    setError('');
    setNotice('');

    if (!form.name.trim()) {
      setError('Organisation name is required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name,
        description: form.description,
        bio: form.bio,
        phoneNumber: form.phoneNumber,
        location: form.location,
        website: form.website
      };
      const res = await updateOrgProfile(payload);
      const updated = res?.data || payload;
      setProfile((current) => ({
        ...(current || {}),
        ...updated
      }));
      setForm({
        name: updated.name || '',
        description: updated.description || '',
        bio: updated.bio || '',
        phoneNumber: updated.phoneNumber || '',
        location: updated.location || '',
        website: updated.website || ''
      });
      setNotice('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setNotice('');
    setLogoUploading(true);

    try {
      const uploadWithPreset = async (preset) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const cloudinaryData = await cloudinaryResponse.json();
        return { cloudinaryResponse, cloudinaryData };
      };

      let { cloudinaryResponse, cloudinaryData } = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET);

      if (!cloudinaryData?.secure_url) {
        const fallbackResult = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET_FALLBACK);
        cloudinaryResponse = fallbackResult.cloudinaryResponse;
        cloudinaryData = fallbackResult.cloudinaryData;
      }

      if (!cloudinaryResponse.ok || !cloudinaryData?.secure_url) {
        throw new Error(cloudinaryData?.error?.message || 'Cloudinary upload failed');
      }

      const res = await updateOrgLogo({ logoUrl: cloudinaryData.secure_url });
      const nextLogo = res?.data?.logo || res?.logo || cloudinaryData.secure_url;

      if (!nextLogo) {
        throw new Error('Logo upload succeeded but no image URL was returned');
      }

      setProfile((current) => ({
        ...(current || {}),
        logo: nextLogo,
        updatedAt: new Date().toISOString()
      }));
      setPhotoFailed(false);
      setNotice('Profile image updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload profile image');
    } finally {
      setLogoUploading(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <div>
          <button
            type="button"
            onClick={() => navigate('/org/settings')}
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
            ← Back to Menu
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '6px' }}>
            {t('profile.title')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            {t('profile.personalInfo')}
          </p>
        </div>
      </div>

      <div className="fh-container">
        {error && (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: 'var(--radius)',
            padding: '12px',
            color: '#FCA5A5',
            fontSize: '0.9rem',
            marginBottom: '12px'
          }}>
            {error}
          </div>
        )}

        {notice && (
          <div style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid #10B981',
            borderRadius: 'var(--radius)',
            padding: '12px',
            color: '#A7F3D0',
            fontSize: '0.9rem',
            marginBottom: '12px'
          }}>
            {notice}
          </div>
        )}

        {!error && (
          <div>
            <div style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderBottom: '1px solid #2A4A6B'
            }}>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />

              <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
                {logoSrc && !photoFailed ? (
                  <img
                    src={logoSrc}
                    alt={profile.name}
                    onError={() => setPhotoFailed(true)}
                    style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #F5A623' }}
                  />
                ) : (
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#F5A623',
                    color: '#1E3A5F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    border: '2px solid #F5A623'
                  }}>
                    {(profile?.name || 'O').charAt(0).toUpperCase()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={logoUploading}
                  aria-label="Change profile image"
                  title="Change profile image"
                  style={{
                    position: 'absolute',
                    right: '-2px',
                    bottom: '-2px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '1px solid #F5A623',
                    background: '#1A3357',
                    color: '#F5A623',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: logoUploading ? 'not-allowed' : 'pointer',
                    opacity: logoUploading ? 0.7 : 1,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 7h4l2-2h4l2 2h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </button>
              </div>

              <div>
                <h2 style={{ fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '4px' }}>
                  {profile?.name || 'Organisation'}
                </h2>
                <p style={{ color: '#F5A623', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 6px 0' }}>
                  @{orgHandle}
                </p>
                <p style={{ color: '#7A9BB5', fontSize: '0.78rem', margin: '0 0 6px 0' }}>
                  <strong style={{ color: '#FFFFFF' }}>{followersTotal}</strong> followers · <strong style={{ color: '#FFFFFF' }}>{followingTotal}</strong> following
                </p>
                {profile?.bio && (
                  <p style={{
                    color: '#B8D0E8',
                    fontSize: '0.84rem',
                    lineHeight: 1.4,
                    margin: '0 0 6px 0',
                    maxWidth: '420px'
                  }}>
                    {profile.bio}
                  </p>
                )}
                <p style={{ fontSize: '0.82rem', color: '#B8D0E8', margin: 0 }}>{profile?.email}</p>
                {logoUploading && (
                  <p style={{ fontSize: '0.75rem', color: '#F5A623', marginTop: '8px' }}>Uploading image...</p>
                )}
              </div>

              <div style={{ marginLeft: 'auto' }}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNotice('');
                      setError('');
                      setIsEditing(true);
                    }}
                    style={{
                      border: '1px solid #F5A623',
                      background: 'rgba(245, 166, 35, 0.12)',
                      color: '#F5A623',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      style={{
                        border: '1px solid #2A4A6B',
                        background: 'transparent',
                        color: '#B8D0E8',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      style={{
                        border: '1px solid #F5A623',
                        background: '#F5A623',
                        color: '#1E3A5F',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: '24px', display: 'grid', gap: '12px' }}>
              {[
                ['Type', profile?.type || 'N/A'],
                ['Status', profile?.status || 'N/A'],
                ['Notifications', profile?.notificationsEnabled ? 'Enabled' : 'Disabled']
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'grid',
                  gridTemplateColumns: '170px 1fr',
                  gap: '12px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#7A9BB5', fontWeight: 700 }}>{label}</span>
                  <span style={{ color: '#FFFFFF', textTransform: 'capitalize', wordBreak: 'break-word' }}>{value}</span>
                </div>
              ))}

              {(followers.length > 0 || following.length > 0) && (
                <div style={{ display: 'grid', gap: '10px', paddingTop: '6px' }}>
                  {followers.length > 0 && (
                    <div>
                      <p style={{ color: '#7A9BB5', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Who follows you</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {followers.map((person) => (
                          <span key={person?._id || person?.id} style={{
                            border: '1px solid #2A4A6B',
                            color: '#B8D0E8',
                            borderRadius: '999px',
                            padding: '5px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {person?.fullName || person?.username || 'User'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {following.length > 0 && (
                    <div>
                      <p style={{ color: '#7A9BB5', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Who you follow</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {following.map((target) => (
                          <span key={target?._id || target?.id} style={{
                            border: '1px solid #2A4A6B',
                            color: '#B8D0E8',
                            borderRadius: '999px',
                            padding: '5px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {target?.name || target?.fullName || target?.username || 'Profile'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isEditing ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Organisation Name</span>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Organisation name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Phone Number</span>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Location</span>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Location"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700 }}>Website</span>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="Website URL"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700, marginTop: '10px' }}>Description</span>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Organisation description"
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '12px', alignItems: 'start' }}>
                    <span style={{ color: '#7A9BB5', fontWeight: 700, marginTop: '10px' }}>Bio</span>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      placeholder="Short bio about your organisation"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#1A3357',
                        color: '#FFFFFF',
                        border: '1px solid #2A4A6B',
                        borderRadius: '10px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {[
                    ['Phone Number', profile?.phoneNumber || 'N/A'],
                    ['Location', profile?.location || 'N/A'],
                    ['Website', profile?.website || 'N/A'],
                    ['Description', profile?.description || 'N/A'],
                    ['Bio', profile?.bio || 'N/A']
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: 'grid',
                      gridTemplateColumns: '170px 1fr',
                      gap: '12px',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ color: '#7A9BB5', fontWeight: 700 }}>{label}</span>
                      <span style={{ color: '#FFFFFF', textTransform: 'capitalize', wordBreak: 'break-word' }}>{value}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div style={{
              padding: '24px',
              borderTop: '1px solid #2A4A6B',
              background: '#152A47'
            }}>
              <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '12px' }}>
                {t('profile.helpSupport')}
              </h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <details style={{ background: '#1A3357', border: '1px solid #2A4A6B', borderRadius: '10px', padding: '10px 12px' }}>
                  <summary style={{ color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>{t('profile.faqs')}</summary>
                  <p style={{ color: '#B8D0E8', fontSize: '0.88rem', marginTop: '8px' }}>
                    Visit the help center for account, applications, and notifications FAQs.
                  </p>
                </details>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href="mailto:support@fursahub.org"
                    style={{
                      background: '#F5A623',
                      color: '#1E3A5F',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textDecoration: 'none'
                    }}
                  >
                    {t('profile.contactUs')}
                  </a>

                  <a
                    href="https://fursahub.onrender.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      border: '1px solid #2A4A6B',
                      color: '#B8D0E8',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    {t('profile.tutorials')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgProfile;
