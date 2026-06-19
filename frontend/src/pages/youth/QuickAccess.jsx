import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  textDecoration: 'none',
  color: '#FFFFFF',
  border: '1px solid #2A4A6B',
  borderRadius: '10px',
  padding: '12px 14px',
  background: '#152A47'
};

const YouthQuickAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-section-head">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F5A623',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            padding: 0
          }}
        >
          ← Back
        </button>
      </div>

      <div className="fh-container" style={{ display: 'grid', gap: '12px', maxWidth: '620px' }}>
        <p style={{ color: '#7A9BB5', fontSize: '0.85rem', margin: 0 }}>
          Choose where to go.
        </p>

        <Link to="/preferences" style={linkStyle}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Interests</span>
          <span style={{ color: '#F5A623', fontWeight: 800 }}>Open →</span>
        </Link>

        <Link to="/applications" style={linkStyle}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Applications</span>
          <span style={{ color: '#F5A623', fontWeight: 800 }}>Open →</span>
        </Link>
      </div>
    </div>
  );
};

export default YouthQuickAccess;
