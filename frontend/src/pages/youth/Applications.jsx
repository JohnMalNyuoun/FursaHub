import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getMyApplications, withdrawApplication } from '../../services/applicationService';

const statusColors = {
  submitted: { bg: '#EBF8FF', color: '#2C5282', label: 'Submitted' },
  under_review: { bg: '#FFFAF0', color: '#744210', label: 'Under Review' },
  shortlisted: { bg: '#F0FFF4', color: '#276749', label: 'Shortlisted' },
  accepted: { bg: '#F0FFF4', color: '#276749', label: 'Accepted' },
  rejected: { bg: '#FFF5F5', color: '#C53030', label: 'Rejected' },
  withdrawn: { bg: '#F7FAFC', color: '#718096', label: 'Withdrawn' }
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await withdrawApplication(id);
      fetchApplications();
    } catch (err) {
      console.error(err);
    } finally {
      setWithdrawing(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
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
            marginBottom: '8px'
          }}>
            My Applications
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Track the status of all your course applications
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {applications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              No applications yet
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Browse courses and apply for ones that interest you
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => {
              const status = statusColors[app.status] || statusColors.submitted;

              return (
                <div key={app._id} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
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
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}>
                        {app.course?.title}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--green-primary)',
                        fontWeight: '600'
                      }}>
                        {app.organisation?.name}
                      </p>
                    </div>

                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      background: status.bg,
                      color: status.color
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Course details */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      📍 {app.course?.location}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      🎓 {app.course?.deliveryMode?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      📅 Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Shortlist next step */}
                  {app.status === 'shortlisted' && app.nextStep?.type && (
                    <div style={{
                      background: '#F0FFF4',
                      border: '1px solid #9AE6B4',
                      borderRadius: 'var(--radius)',
                      padding: '12px 16px',
                      marginBottom: '16px'
                    }}>
                      <p style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#276749',
                        marginBottom: '4px'
                      }}>
                        🎉 You have been shortlisted!
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#276749' }}>
                        Next step: {app.nextStep.type === 'in_person' ? 'In-person interview' : 'Online interview'}
                      </p>
                      {app.nextStep.location && (
                        <p style={{ fontSize: '0.82rem', color: '#276749' }}>
                          📍 {app.nextStep.location}
                        </p>
                      )}
                      {app.nextStep.scheduledAt && (
                        <p style={{ fontSize: '0.82rem', color: '#276749' }}>
                          🕐 {new Date(app.nextStep.scheduledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {app.status === 'rejected' && app.rejectionReason && (
                    <div style={{
                      background: '#FFF5F5',
                      border: '1px solid #FEB2B2',
                      borderRadius: 'var(--radius)',
                      padding: '12px 16px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '0.82rem', color: '#C53030' }}>
                        Reason: {app.rejectionReason}
                      </p>
                    </div>
                  )}

                  {/* Withdraw */}
                  {['submitted', 'under_review', 'shortlisted'].includes(app.status) && (
                    <Button
                      variant="outline"
                      loading={withdrawing === app._id}
                      onClick={() => handleWithdraw(app._id)}
                      style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    >
                      Withdraw Application
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;