import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const isDeadlinePassed = new Date() > new Date(course.applicationDeadline);
  const isFull = course.filledSlots >= course.totalSlots;
  const cardImage = (course.coverImage || course.organisation?.logo || '').replace('http://', 'https://');

  const status = isFull ? 'Full' : isDeadlinePassed ? 'Closed' : 'Open';
  const statusStyle = status === 'Open'
    ? { background: 'rgba(245,166,35,0.15)', color: '#F5A623' }
    : status === 'Full'
    ? { background: 'rgba(229,62,62,0.15)', color: '#FCA5A5' }
    : { background: 'rgba(148,163,184,0.15)', color: '#94A3B8' };

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#1A3357',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #2A4A6B',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          height: '100%',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.3)';
        }}
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={course.title}
            style={{
              width: 'calc(100% + 40px)',
              height: '180px',
              objectFit: 'cover',
              margin: '-20px -20px 16px',
              display: 'block',
              borderBottom: '1px solid #2A4A6B'
            }}
          />
        ) : (
          <div style={{
            width: 'calc(100% + 40px)',
            height: '180px',
            margin: '-20px -20px 16px',
            borderBottom: '1px solid #2A4A6B',
            background: 'linear-gradient(135deg, #122845 0%, #1E3A5F 60%, #2B527E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B8D0E8',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}>
            Course Cover
          </div>
        )}

        {/* Category badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          background: 'rgba(245,166,35,0.15)',
          color: '#F5A623',
          marginBottom: '12px'
        }}>
          {course.category}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '6px',
          lineHeight: 1.3
        }}>
          {course.title}
        </h3>

        {/* Organisation */}
        <p style={{
          fontSize: '0.85rem',
          color: '#F5A623',
          fontWeight: 700,
          marginBottom: '14px'
        }}>
          {course.organisation?.name}
        </p>

        {/* Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#7A9BB5' }}>
            📍 {course.location}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#7A9BB5' }}>
            🎓 {course.deliveryMode.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#7A9BB5' }}>
            📅 Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
          </span>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.78rem',
            color: '#7A9BB5',
            fontWeight: 600
          }}>
            {course.totalSlots - course.filledSlots} slots left
          </span>

          <span style={{
            ...statusStyle,
            borderRadius: '20px',
            padding: '4px 12px',
            fontSize: '0.75rem',
            fontWeight: 800
          }}>
            {status}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
