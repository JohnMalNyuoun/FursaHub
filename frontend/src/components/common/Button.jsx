const Button = ({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  ...props
}) => {
  const base = {
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: 'var(--radius)',
    transition: 'var(--transition)',
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.7 : 1,
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  const variants = {
    primary: {
      background: 'var(--green-primary)',
      color: '#FFFFFF',
      border: 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--green-primary)',
      border: '2px solid var(--green-primary)',
    },
    danger: {
      background: '#e53e3e',
      color: '#FFFFFF',
      border: 'none',
    }
  };

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      disabled={loading}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;