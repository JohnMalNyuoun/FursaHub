const Button = ({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  style = {},
  ...props
}) => {
  const base = {
    fontFamily: 'inherit',
    fontWeight: 700,
    borderRadius: '10px',
    transition: 'all 0.15s ease',
    letterSpacing: '0.01em',
    minHeight: '44px',
    width: fullWidth ? '100%' : 'auto',
    opacity: loading ? 0.75 : 1,
    cursor: loading ? 'not-allowed' : 'pointer',
    border: 'none',
    fontSize: '0.95rem',
  };

  const variants = {
    primary: {
      background: '#F5A623',
      color: '#1E3A5F',
      padding: '13px 24px',
      boxShadow: '0 2px 8px rgba(245, 166, 35, 0.3)',
    },
    outline: {
      background: 'transparent',
      border: '2px solid #F5A623',
      color: '#F5A623',
      padding: '11px 24px',
    },
    danger: {
      background: '#E53E3E',
      color: '#FFFFFF',
      padding: '13px 24px',
      boxShadow: '0 2px 8px rgba(229, 62, 62, 0.2)',
    }
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      disabled={loading}
      {...props}
    >
      {loading ? '· · ·' : children}
    </button>
  );
};

export default Button;
