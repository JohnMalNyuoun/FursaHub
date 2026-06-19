import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Organisations = () => {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchOrganisations = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/admin/organisations', { params });
      setOrganisations(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisations();
  }, [filterStatus]);

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await api.put(`/admin/organisations/${id}/approve`);
      fetchOrganisations();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading('reject');
    try {
      await api.put(`/admin/organisations/${rejectModal}/reject`, { rejectionReason });
      setRejectModal(null);
      setRejectionReason('');
      fetchOrganisations();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this organisation?')) return;
    setActionLoading(id + '_suspend');
    try {
      await api.put(`/admin/organisations/${id}/suspend`);
      fetchOrganisations();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <div className="fh-section-head">
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            Organisations
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Approve, reject and manage organisations on FursaHub
          </p>
        </div>
      </div>

      <div className="fh-container">

        {/* Filter */}
        <div style={{ marginBottom: '24px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
              minWidth: '180px'
            }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {organisations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p>No organisations found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {organisations.map(org => (
              <div key={org._id} style={{
                background: '#1A3357',
                border: '1px solid #2A4A6B',
                borderLeft: org.status === 'pending' ? '3px solid #F5A623' : '1px solid #2A4A6B',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: '#F5A623',
                        color: '#1E3A5F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}>
                        {(org.name || 'O').charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      marginBottom: '2px'
                    }}>
                      <Link
                        to={`/profiles/organisation/${org._id}`}
                        style={{ color: '#FFFFFF', textDecoration: 'underline' }}
                      >
                        {org.name}
                      </Link>
                    </h3>
                    <p style={{
                      fontSize: '0.82rem',
                      color: '#7A9BB5'
                    }}>
                      {org.type} · {org.location}
                    </p>
                  </div>
                  </div>

                  <span className={`fh-badge fh-badge-${org.status}`}>
                    {org.status}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: '#B8D0E8',
                  marginBottom: '12px',
                  lineHeight: '1.6'
                }}>
                  {org.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                    📧 {org.email}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                    📞 {org.phoneNumber}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                    📅 Registered {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {org.status === 'pending' && (
                    <>
                      <Button
                        loading={actionLoading === org._id + '_approve'}
                        onClick={() => handleApprove(org._id)}
                        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => setRejectModal(org._id)}
                        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {org.status === 'approved' && (
                    <Button
                      variant="outline"
                      loading={actionLoading === org._id + '_suspend'}
                      onClick={() => handleSuspend(org._id)}
                      style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius)',
            padding: '32px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '6px'
            }}>
              Reject Organisation
            </h2>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              marginBottom: '20px'
            }}>
              Provide a reason for rejection
            </p>

            <textarea
              placeholder="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '0.9rem',
                color: '#FFFFFF',
                background: '#152A47',
                border: '1px solid #2A4A6B',
                borderRadius: 'var(--radius)',
                resize: 'vertical',
                marginBottom: '20px'
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                fullWidth
                variant="danger"
                loading={actionLoading === 'reject'}
                onClick={handleReject}
              >
                Confirm Reject
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => { setRejectModal(null); setRejectionReason(''); }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organisations;