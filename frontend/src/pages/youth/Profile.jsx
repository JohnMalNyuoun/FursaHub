import { useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getYouthProfile, updateYouthProfile, updateYouthPhoto } from '../../services/profileService';

const CLOUDINARY_CLOUD_NAME = 'dkxjwhxne';
const CLOUDINARY_PROFILE_PRESET = 'Fursahub-profile';
const CLOUDINARY_PROFILE_PRESET_FALLBACK = 'fursahub-courses';

const editInputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#152A47',
  color: '#FFFFFF',
  border: '1px solid #2A4A6B',
  borderRadius: '10px',
  fontSize: '0.9rem'
};

const YouthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', username: '', bio: '' });
  const [newPhoto, setNewPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await getYouthProfile();
      setProfile(res.data);
      setEditForm({
        fullName: res.data.fullName || '',
        username: res.data.username || '',
        bio: res.data.bio || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveError('');
    setSaveNotice('');
    try {
      const payload = {
        fullName: editForm.fullName,
        bio: editForm.bio,
        ...(editForm.username.trim() ? { username: editForm.username } : {})
      };

      if (newPhoto) {
        const uploadWithPreset = async (preset) => {
          const fd = new FormData();
          fd.append('file', newPhoto);
          fd.append('upload_preset', preset);
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: fd }
          );
          return res.json();
        };
        let data = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET);
        if (!data?.secure_url) data = await uploadWithPreset(CLOUDINARY_PROFILE_PRESET_FALLBACK);
        if (data?.secure_url) {
          await updateYouthPhoto({ photoUrl: data.secure_url });
          payload.photo = data.secure_url;
        }
        setNewPhoto(null);
      }

      const res = await updateYouthProfile(payload);
      setProfile((prev) => ({ ...prev, ...res.data, updatedAt: new Date().toISOString() }));
      setSaveNotice('Profile updated successfully.');
      setTimeout(() => setSaveNotice(''), 3000);
      setEditMode(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

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

  const photoVersionedSrc = useMemo(() => {
    if (!profile?.photo) return '';
    const version = profile?.updatedAt ? encodeURIComponent(profile.updatedAt) : '';
    if (!version) return profile.photo;
    const separator = profile.photo.includes('?') ? '&' : '?';
    return `${profile.photo}${separator}v=${version}`;
  }, [profile?.photo, profile?.updatedAt]);

  const registrationId = profile?._id || 'N/A';
  const trainingPhaseProgress = profile?.trainingPhaseProgress ?? 0;
  const mentorshipAttendanceRate = profile?.mentorshipAttendanceRate ?? 0;
  const capstoneProgress = profile?.capstoneProgress ?? 0;
  const skills = profile?.skills || [];
  const activityLogs = profile?.activityLogs || [];

  useEffect(() => {
    setPhotoFailed(false);
  }, [profile?.photo]);

  if (loading) return <Loader />;

  return (
    <div style={{ background: '#0F1620', minHeight: '100vh' }}>
      <Navbar />

      {error ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: '12px',
            padding: '12px',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        </div>
      ) : (
        <>
          {/* Cover Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1A3357 0%, #2A5A8F 50%, #152A47 100%)',
            padding: '40px 20px',
            textAlign: 'center',
            borderBottom: '2px solid #2A4A6B',
            position: 'relative'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Profile Image & Name Row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '24px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {/* Profile Photo */}
                <button
                  type="button"
                  onClick={() => setShowPhotoPreview(true)}
                  title="View profile image"
                  style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  {profile?.photo && !photoFailed ? (
                    <img
                      src={photoVersionedSrc}
                      alt={profile.fullName}
                      onError={() => setPhotoFailed(true)}
                      style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '6px solid #F5A623',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: '#F5A623',
                      color: '#1E3A5F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '2.4rem',
                      border: '6px solid #F5A623',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                    }}>
                      {initials}
                    </div>
                  )}
                </button>

                {/* Name & Edit Button */}
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: 900, margin: '0 0 6px 0' }}>
                    {profile?.fullName || 'Youth User'}
                  </h1>
                  <p style={{ color: '#F5A623', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px 0' }}>
                    @{profile?.username || 'username_not_set'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditMode((prev) => !prev)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: editMode ? 'transparent' : '#F5A623',
                      color: editMode ? '#F5A623' : '#FFFFFF',
                      border: editMode ? '2px solid #F5A623' : 'none',
                      fontWeight: 800,
                      borderRadius: '8px',
                      padding: '10px 18px',
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>

              {/* Bio & Details */}
              {!editMode && (
                <>
                  {profile?.bio && (
                    <p style={{
                      color: '#B8D0E8',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      maxWidth: '600px',
                      margin: '20px auto 0',
                      fontStyle: 'italic'
                    }}>
                      {profile.bio}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', fontSize: '0.9rem', color: '#B8D0E8' }}>
                    {profile?.age && <span>Age: <strong>{profile.age}</strong></span>}
                    {profile?.gender && <span>Gender: <strong style={{ textTransform: 'capitalize' }}>{profile.gender}</strong></span>}
                    {profile?.communityType && <span>Community: <strong style={{ textTransform: 'capitalize' }}>{profile.communityType.replace('_', ' ')}</strong></span>}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Form or Content Section */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            {editMode ? (
              <div style={{
                background: '#1A3357',
                border: '2px solid #F5A623',
                borderRadius: '18px',
                padding: '32px',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                <h2 style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
                  Edit Profile
                </h2>

                {saveError && (
                  <div style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid #E53E3E', borderRadius: '10px', padding: '12px', color: '#FCA5A5', marginBottom: '16px', fontSize: '0.88rem' }}>
                    {saveError}
                  </div>
                )}
                {saveNotice && (
                  <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid #10B981', borderRadius: '10px', padding: '12px', color: '#A7F3D0', marginBottom: '16px', fontSize: '0.88rem' }}>
                    {saveNotice}
                  </div>
                )}

                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block', marginBottom: '6px', fontWeight: 700 }}>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewPhoto(e.target.files?.[0] || null)} style={{ color: '#FFFFFF', fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block', marginBottom: '6px', fontWeight: 700 }}>Display Name</label>
                    <input style={editInputStyle} value={editForm.fullName} onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block', marginBottom: '6px', fontWeight: 700 }}>Username</label>
                    <input style={editInputStyle} value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} placeholder="your_username" />
                  </div>
                  <div>
                    <label style={{ color: '#B8D0E8', fontSize: '0.82rem', display: 'block', marginBottom: '6px', fontWeight: 700 }}>Bio</label>
                    <textarea rows={4} style={editInputStyle} value={editForm.bio} onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{
                      flex: 1,
                      background: '#F5A623',
                      color: '#1E3A5F',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '14px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: '#B8D0E8',
                      border: '1px solid #2A4A6B',
                      borderRadius: '10px',
                      padding: '14px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <section style={{ display: 'grid', gap: '32px' }}>
                {/* Personal Information */}
                <div style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '16px',
                  padding: '28px'
                }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                    Personal Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {[
                      ['Full Name', profile?.fullName || 'N/A'],
                      ['Age', profile?.age || 'N/A'],
                      ['Gender', profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'N/A'],
                      ['Language', profile?.language || 'N/A'],
                      ['Email', profile?.email || 'N/A'],
                      ['Phone', profile?.phoneNumber || 'N/A'],
                      ['Registration ID', registrationId],
                      ['Theme', profile?.theme || 'N/A']
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ color: '#7A9BB5', fontSize: '0.82rem', fontWeight: 700, margin: '0 0 4px 0' }}>{label}</p>
                        <p style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600, margin: 0, wordBreak: 'break-word' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Tracking */}
                <div style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '16px',
                  padding: '28px'
                }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                    Progress Tracking
                  </h3>
                  <div style={{ display: 'grid', gap: '22px' }}>
                    {[
                      ['Training Phase Progress', trainingPhaseProgress],
                      ['Mentorship Attendance Rate', mentorshipAttendanceRate],
                      ['Capstone Progress', capstoneProgress]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}>{label}</span>
                          <span style={{ color: '#F5A623', fontWeight: 800, fontSize: '0.9rem' }}>{value}%</span>
                        </div>
                        <div style={{ height: '14px', background: '#152A47', borderRadius: '8px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${Math.max(0, Math.min(100, value))}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #4A9EFF 0%, #F5A623 100%)',
                            borderRadius: '8px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '16px',
                  padding: '28px'
                }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                    Skills
                  </h3>
                  {skills.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {skills.map((skill) => (
                        <span key={skill} style={{
                          background: '#0F2035',
                          color: '#B8D0E8',
                          border: '1px solid #2A4A6B',
                          borderRadius: '20px',
                          padding: '8px 14px',
                          fontSize: '0.84rem',
                          fontWeight: 700
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#7A9BB5', fontSize: '0.95rem', margin: 0 }}>No skills listed yet.</p>
                  )}
                </div>

                {/* Activity Log */}
                <div style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '16px',
                  padding: '28px'
                }}>
                  <h3 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                    Activity Log
                  </h3>
                  {activityLogs.length > 0 ? (
                    <div style={{ display: 'grid', gap: '14px' }}>
                      {activityLogs.map((log, index) => (
                        <div key={`${log.timestamp || index}-${index}`} style={{
                          padding: '16px',
                          border: '1px solid #2A4A6B',
                          borderRadius: '12px',
                          background: '#152A47'
                        }}>
                          <p style={{ margin: '0 0 6px 0', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600 }}>
                            {log.text || log.message || 'Activity recorded'}
                          </p>
                          <p style={{ margin: 0, color: '#7A9BB5', fontSize: '0.8rem' }}>
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'No timestamp available'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#7A9BB5', fontSize: '0.95rem', margin: 0 }}>No activity logs available yet.</p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Photo Preview Modal */}
          {showPhotoPreview && (
            <div
              onClick={() => setShowPhotoPreview(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200,
                padding: '20px'
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '18px',
                  padding: '20px',
                  maxWidth: '500px',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {profile?.photo && !photoFailed ? (
                  <img
                    src={photoVersionedSrc}
                    alt={profile?.fullName || 'Profile photo'}
                    style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '12px' }}
                  />
                ) : (
                  <div style={{
                    width: '220px',
                    height: '220px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    background: '#F5A623',
                    color: '#1E3A5F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '3rem'
                  }}>
                    {initials}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPhotoPreview(false)}
                  style={{
                    marginTop: '16px',
                    background: '#F5A623',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default YouthProfile;
