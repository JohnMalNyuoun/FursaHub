import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { COURSE_CATEGORIES } from '../../utils/constants';

const categoryIcons = {
  technology: '💻',
  business: '💼',
  health: '🏥',
  education: '📚',
  vocational: '🔧',
  language: '🌍',
  leadership: '🎯',
  other: '✨'
};

const Preferences = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/youth/profile');
        setSelected(res.data?.data?.categoryPreferences || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleCategory = (value) => {
    setSelected((prev) => (
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    ));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/youth/profile/preferences', {
        categoryPreferences: selected
      });
      setSaved(true);
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <section style={{
        background: 'linear-gradient(140deg, #0F2035 0%, #1E3A5F 100%)',
        padding: '32px 20px',
        borderBottom: '1px solid #2A4A6B'
      }}>
        <div className="fh-container" style={{ maxWidth: '960px', padding: 0 }}>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.95rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            Your Interests
          </h1>

          <p style={{
            color: '#B8D0E8',
            fontSize: '0.92rem',
            maxWidth: '700px'
          }}>
            Select the categories you are interested in. FursaHub will notify you every time a matching course is posted in Kakuma.
          </p>
        </div>
      </section>

      <div className="fh-container" style={{ maxWidth: '960px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: 'rgba(245,166,35,0.14)',
          border: '1px solid rgba(245,166,35,0.35)',
          color: '#FDE68A',
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '18px'
        }}>
          <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>🔔</span>
          <p style={{ fontSize: '0.88rem', color: '#F5D79F' }}>
            You will receive a notification every time an organisation posts a course in your selected categories. You can update these anytime.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '18px'
        }}>
          {COURSE_CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.value);

            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                style={{
                  background: isSelected ? 'rgba(245,166,35,0.15)' : 'var(--bg-card)',
                  border: isSelected ? '2px solid #F5A623' : '2px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '20px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                  position: 'relative',
                  minHeight: '112px'
                }}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '10px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '999px',
                    background: '#F5A623',
                    color: '#1E3A5F',
                    fontSize: '0.8rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ✓
                  </span>
                )}

                <div style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
                  {categoryIcons[cat.value] || '✨'}
                </div>

                <div style={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}>
                  {cat.label}
                </div>
              </button>
            );
          })}
        </div>

        <p style={{
          color: selected.length === 0 ? '#FCA5A5' : '#B8D0E8',
          fontSize: '0.86rem',
          marginBottom: '14px'
        }}>
          {selected.length === 0
            ? 'No categories selected - you will not receive course alerts.'
            : `${selected.length} categor${selected.length === 1 ? 'y' : 'ies'} selected`}
        </p>

        {saved ? (
          <div style={{
            background: 'rgba(245,166,35,0.18)',
            border: '1px solid rgba(245,166,35,0.4)',
            borderRadius: '10px',
            padding: '12px 14px',
            color: '#FDE68A',
            fontWeight: 700,
            marginBottom: '28px'
          }}>
            ✓ Preferences saved! Redirecting...
          </div>
        ) : (
          <div style={{ marginBottom: '28px' }}>
            <Button
              onClick={handleSave}
              loading={saving}
              fullWidth
              style={{ maxWidth: '320px' }}
            >
              Save My Interests
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preferences;
