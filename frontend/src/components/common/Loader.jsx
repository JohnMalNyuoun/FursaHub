const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      background: '#0F2035'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #2A4A6B',
        borderTopColor: '#F5A623',
        borderRadius: '50%',
        animation: 'fh-spin 0.7s linear infinite'
      }} />
      <p style={{
        marginTop: '16px',
        fontSize: '0.82rem',
        color: '#7A9BB5',
        fontWeight: 600
      }}>
        Loading...
      </p>
    </div>
  );
};

export default Loader;
