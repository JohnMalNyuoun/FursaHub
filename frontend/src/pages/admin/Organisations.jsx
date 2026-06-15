import { useState, useEffect } from 'react';
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

      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '32px 24px'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
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

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

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
                background: 'var(--bg-card)',
                border: `1px solid ${org.status === 'pending' ? '#FAD08A' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius)',
                padding: '24px',
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
                  <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      marginBottom: '2px'
                    }}>
                      {org.name}
                    </h3>
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)'
                    }}>
                      {org.type} · {org.location}
                    </p>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    background: org.status === 'approved' ? '#F0FFF4'
                      : org.status === 'pending' ? '#FFFAF0'
                      : '#FFF5F5',
                    color: org.status === 'approved' ? '#276749'
                      : org.status === 'pending' ? '#744210'
                      : '#C53030'
                  }}>
                    {org.status}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
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
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📧 {org.email}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📞 {org.phoneNumber}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
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
                color: 'var(--text-primary)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
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