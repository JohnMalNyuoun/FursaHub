import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getMyApplications, withdrawApplication } from '../../services/applicationService';

const statusLabels = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn'
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
      <div className="fh-section-head">
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '6px'
          }}>
            My Applications
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Track the status of all your course applications
          </p>
        </div>
      </div>

      <div className="fh-container">

        {applications.length === 0 ? (
          <div className="fh-empty">
            <div className="fh-empty-icon">📝</div>
            <p style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              No applications yet
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Browse courses and apply for ones that interest you
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => {
              const label = statusLabels[app.status] || 'Submitted';

              return (
                <div key={app._id} style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
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
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        marginBottom: '4px'
                      }}>
                        {app.course?.title}
                      </h3>
                      <p style={{
                        fontSize: '0.85rem',
                        color: '#F5A623',
                        fontWeight: '600'
                      }}>
                        {app.organisation?.name}
                      </p>
                    </div>

                    <span className={`fh-badge fh-badge-${app.status}`}>
                      {label}
                    </span>
                  </div>

                  {/* Course details */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                      📍 {app.course?.location}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                      🎓 {app.course?.deliveryMode?.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                      📅 Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Shortlist next step */}
                  {app.status === 'shortlisted' && app.nextStep?.type && (
                    <div style={{
                      background: 'rgba(245,166,35,0.1)',
                      borderLeft: '3px solid #F5A623',
                      borderRadius: 'var(--radius)',
                      padding: '12px 16px',
                      marginBottom: '16px'
                    }}>
                      <p style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#F5A623',
                        marginBottom: '4px'
                      }}>
                        🎉 You have been shortlisted!
                      </p>
                      <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                        Next step: {app.nextStep.type === 'in_person' ? 'In-person interview' : 'Online interview'}
                      </p>
                      {app.nextStep.location && (
                        <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                          📍 {app.nextStep.location}
                        </p>
                      )}
                      {app.nextStep.scheduledAt && (
                        <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                          🕐 {new Date(app.nextStep.scheduledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {app.status === 'rejected' && app.rejectionReason && (
                    <div style={{
                      background: 'rgba(229,62,62,0.1)',
                      borderLeft: '3px solid #E53E3E',
                      borderRadius: 'var(--radius)',
                      padding: '12px 16px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ fontSize: '0.82rem', color: '#FCA5A5' }}>
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
                      className="fh-mobile-full"
                      style={{ fontSize: '0.85rem', padding: '10px 18px', minHeight: '44px' }}
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