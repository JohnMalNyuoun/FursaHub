import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getMyApplications, withdrawApplication } from '../../services/applicationService';

const statusConfig = {
  submitted: {
    label: 'Submitted',
    color: '#93C5FD',
    bg: 'rgba(59,130,246,0.15)',
    icon: '📝'
  },
  under_review: {
    label: 'Under Review',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.15)',
    icon: '🔍'
  },
  shortlisted: {
    label: 'Shortlisted',
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.2)',
    icon: '🎉'
  },
  accepted: {
    label: 'Accepted',
    color: '#D4891A',
    bg: 'rgba(245,166,35,0.25)',
    icon: '✅'
  },
  rejected: {
    label: 'Not Selected',
    color: '#FCA5A5',
    bg: 'rgba(229,62,62,0.15)',
    icon: '💪'
  },
  withdrawn: {
    label: 'Withdrawn',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.15)',
    icon: '↩️'
  }
};

const allStages = ['submitted', 'under_review', 'shortlisted', 'accepted'];
const stageLabels = {
  submitted: 'Application Sent',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  accepted: 'Accepted'
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);
  const [expandedApp, setExpandedApp] = useState(null);

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

  const getStageIndex = (status) => {
    if (status === 'rejected' || status === 'withdrawn') return -1;
    return allStages.indexOf(status);
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
            {applications.length} application{applications.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      <div className="fh-container">

        {applications.length === 0 ? (
          <div className="fh-empty">
            <div className="fh-empty-icon">📋</div>
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
              const config = statusConfig[app.status] || statusConfig.submitted;
              const isExpanded = expandedApp === app._id;
              const stageIndex = getStageIndex(app.status);
              const isRejected = app.status === 'rejected';
              const isWithdrawn = app.status === 'withdrawn';
              const timeline = Array.isArray(app.timeline) ? app.timeline : [];

              return (
                <div key={app._id} style={{
                  background: '#1A3357',
                  border: '1px solid #2A4A6B',
                  borderRadius: '16px',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  {/* Card header */}
                  <div
                    onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                    style={{
                      padding: '18px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    {/* Status icon */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: config.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {config.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '1.03rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '4px'
                      }}>
                        {app.course?.title}
                      </h3>

                      <p style={{
                        fontSize: '0.85rem',
                        color: '#F5A623',
                        fontWeight: 600,
                        marginBottom: '2px'
                      }}>
                        {app.organisation?.name}
                      </p>

                      <p style={{
                        fontSize: '0.78rem',
                        color: '#7A9BB5'
                      }}>
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status badge + expand */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        color: config.color,
                        background: config.bg,
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        marginBottom: '6px'
                      }}>
                        {config.label}
                      </span>
                      <p style={{ fontSize: '0.76rem', color: '#B8D0E8', fontWeight: 700 }}>
                        {isExpanded ? '▲ Less' : '▼ Details'}
                      </p>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid #2A4A6B',
                      padding: '16px 20px 20px'
                    }}>
                      {/* Progress timeline */}
                      {!isRejected && !isWithdrawn && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
                            Application Progress
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            {allStages.map((stage, i) => {
                              const isCompleted = i <= stageIndex;
                              return (
                                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: isCompleted ? '#F5A623' : '#2A4A6B',
                                    color: isCompleted ? '#1E3A5F' : '#7A9BB5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.78rem',
                                    fontWeight: 800
                                  }}>
                                    {i + 1}
                                  </div>
                                  <span style={{
                                    fontSize: '0.76rem',
                                    color: isCompleted ? '#FDF3E0' : '#7A9BB5',
                                    fontWeight: 700
                                  }}>
                                    {stageLabels[stage]}
                                  </span>

                                  {/* Connector line */}
                                  {i < allStages.length - 1 && (
                                    <div style={{
                                      width: '26px',
                                      height: '2px',
                                      background: i < stageIndex ? '#F5A623' : '#2A4A6B'
                                    }} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Rejected / withdrawn message */}
                      {(isRejected || isWithdrawn) && (
                        <div style={{
                          background: isRejected ? 'rgba(229,62,62,0.1)' : 'rgba(148,163,184,0.12)',
                          borderLeft: `3px solid ${isRejected ? '#E53E3E' : '#94A3B8'}`,
                          borderRadius: '10px',
                          padding: '12px 14px',
                          marginBottom: '14px'
                        }}>
                          <p style={{
                            color: isRejected ? '#FCA5A5' : '#CBD5E1',
                            fontSize: '0.84rem',
                            fontWeight: 700
                          }}>
                            {isRejected
                              ? 'Keep trying! The right opportunity is coming.'
                              : 'This application has been withdrawn.'}
                          </p>
                          {isRejected && app.rejectionReason && (
                            <p style={{ color: '#FCA5A5', fontSize: '0.8rem', marginTop: '4px' }}>
                              Reason: {app.rejectionReason}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Activity History */}
                      {timeline.length > 0 && (
                        <div style={{ marginBottom: '14px' }}>
                          <p style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                            Activity History
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {timeline.map((entry, i) => (
                              <div key={`${entry.status}-${entry.timestamp}-${i}`} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                background: '#152A47',
                                border: '1px solid #2A4A6B',
                                borderRadius: '10px',
                                padding: '10px'
                              }}>
                                <span style={{ color: '#F5A623', fontSize: '0.95rem' }}>•</span>
                                <div>
                                  <p style={{ color: '#E2E8F0', fontSize: '0.83rem', fontWeight: 600 }}>
                                    {entry.message}
                                  </p>
                                  <p style={{ color: '#7A9BB5', fontSize: '0.74rem', marginTop: '2px' }}>
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shortlist next step */}
                      {app.status === 'shortlisted' && app.nextStep?.type && (
                        <div style={{
                          background: 'rgba(245,166,35,0.1)',
                          borderLeft: '3px solid #F5A623',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          marginBottom: '14px'
                        }}>
                          <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#F5A623',
                            marginBottom: '4px'
                          }}>
                            🎉 Interview Details
                          </p>

                          <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                            Type: {app.nextStep.type === 'in_person'
                              ? 'In-person interview' : 'Online interview'}
                          </p>

                          {app.nextStep.location && (
                            <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                              📍 {app.nextStep.location}
                            </p>
                          )}
                          {app.nextStep.scheduledAt && (
                            <p style={{ fontSize: '0.82rem', color: '#FDF3E0' }}>
                              📅 {new Date(app.nextStep.scheduledAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Course details */}
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '14px'
                      }}>
                        {[
                          {
                            label: '📍 Location',
                            value: app.course?.location
                          },
                          {
                            label: '🎓 Mode',
                            value: app.course?.deliveryMode?.replace('_', ' ')
                          },
                          {
                            label: '📅 Starts',
                            value: app.course?.startDate
                              ? new Date(app.course.startDate).toLocaleDateString()
                              : null
                          }
                        ].filter(d => d.value).map((detail) => (
                          <span key={detail.label} style={{ fontSize: '0.78rem', color: '#7A9BB5' }}>
                            {detail.label}: {detail.value}
                          </span>
                        ))}
                      </div>

                      {/* Withdraw button */}
                      {['submitted', 'under_review', 'shortlisted'].includes(app.status) && (
                        <Button
                          variant="outline"
                          loading={withdrawing === app._id}
                          onClick={() => handleWithdraw(app._id)}
                          style={{
                            fontSize: '0.82rem',
                            padding: '8px 16px',
                            width: '100%'
                          }}
                        >
                          Withdraw Application
                        </Button>
                      )}
                    </div>
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