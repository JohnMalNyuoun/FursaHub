const Input = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          marginBottom: '6px'
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: '0.95rem',
          color: 'var(--text-primary)',
          background: 'var(--bg-surface)',
          border: `1px solid ${error ? '#e53e3e' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius)',
          transition: 'var(--transition)',
        }}
        {...props}
      />
      {error && (
        <span style={{
          fontSize: '0.8rem',
          color: '#e53e3e',
          marginTop: '4px',
          display: 'block'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;