import { Link } from 'react-router-dom';

const categoryColors = {
  technology: '#1d9e68',
  business: '#d69e2e',
  health: '#e53e3e',
  education: '#3182ce',
  vocational: '#805ad5',
  language: '#dd6b20',
  leadership: '#2c7a7b',
  other: '#718096'
};

const CourseCard = ({ course }) => {
  const isDeadlinePassed = new Date() > new Date(course.applicationDeadline);
  const isFull = course.filledSlots >= course.totalSlots;

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        cursor: 'pointer',
        transition: 'var(--transition)',
        height: '100%'
      }}>
        {/* Category badge */}
        <div style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          background: `${categoryColors[course.category]}20`,
          color: categoryColors[course.category],
          marginBottom: '12px'
        }}>
          {course.category}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: '1.4'
        }}>
          {course.title}
        </h3>

        {/* Organisation */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--green-primary)',
          fontWeight: '600',
          marginBottom: '12px'
        }}>
          {course.organisation?.name}
        </p>

        {/* Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '16px'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            📍 {course.location}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            🎓 {course.deliveryMode.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            📅 Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
          </span>
        </div>

        {/* Slots + Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            {course.totalSlots - course.filledSlots} slots left
          </span>

          <span style={{
            fontSize: '0.78rem',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '20px',
            background: isFull || isDeadlinePassed ? '#FFF5F5' : '#F0FFF4',
            color: isFull || isDeadlinePassed ? '#C53030' : '#276749'
          }}>
            {isFull ? 'Full' : isDeadlinePassed ? 'Closed' : 'Open'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;