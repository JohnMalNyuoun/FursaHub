import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getCourse } from '../../services/courseService';
import { applyForCourse, getMyApplications } from '../../services/applicationService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [detailImageIndex, setDetailImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, appsRes] = await Promise.all([
          getCourse(id),
          getMyApplications()
        ]);

        const fetchedCourse = courseRes.data;
        setCourse(fetchedCourse);

        // Initialize answers
        setAnswers(fetchedCourse.applicationQuestions.map(q => ({
          question: q.question,
          answer: ''
        })));

        // Check if already applied
        const applied = appsRes.data.some(app => app.course?._id === id);
        setAlreadyApplied(applied);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setDetailImageIndex(0);
  }, [id, course?.coverImage, course?.organisation?.logo]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index].answer = value;
    setAnswers(updated);
  };

  const handleApply = async () => {
    setError('');
    setApplying(true);

    try {
      await applyForCourse(id, { answers });
      setSuccess('Application submitted successfully!');
      setAlreadyApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader />;
  if (!course) return <div>Course not found</div>;

  const isDeadlinePassed = new Date() > new Date(course.applicationDeadline);
  const isFull = course.filledSlots >= course.totalSlots;
  const canApply = !alreadyApplied && !isDeadlinePassed && !isFull;
  const detailImageCandidates = [course.coverImage, course.organisation?.logo]
    .filter(Boolean)
    .map((url) => url.replace('http://', 'https://'));
  const detailImage = detailImageCandidates[detailImageIndex] || '';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/courses')}
          style={{
            background: 'none',
            border: 'none',
            color: '#F5A623',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '24px',
            padding: 0
          }}
        >
          ← Back to courses
        </button>

        {/* Header */}
        <div style={{
          padding: detailImage ? '0 0 24px' : '0 0 24px',
          marginBottom: '24px',
          borderBottom: '1px solid #2A4A6B'
        }}>
          {detailImage ? (
            <img
              src={detailImage}
              alt={course.title}
              onError={() => {
                if (detailImageIndex < detailImageCandidates.length - 1) {
                  setDetailImageIndex((current) => current + 1);
                } else {
                  setDetailImageIndex(detailImageCandidates.length);
                }
              }}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                display: 'block',
                borderBottom: '1px solid #2A4A6B',
                marginBottom: '24px'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '220px',
              borderBottom: '1px solid #2A4A6B',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #122845 0%, #1E3A5F 60%, #2B527E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B8D0E8',
              fontSize: '1rem',
              fontWeight: '800'
            }}>
              Course Cover
            </div>
          )}

          <div style={{ padding: detailImage ? '0 32px' : 0 }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'rgba(245,166,35,0.15)',
            color: '#F5A623',
            marginBottom: '16px'
          }}>
            {course.category}
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            {course.title}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#F5A623',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            <Link
              to={`/profiles/organisation/${course.organisation?._id}`}
              style={{ color: '#F5A623', textDecoration: 'underline' }}
            >
              {course.organisation?.name}
            </Link>{' '}
            · {course.organisation?.type}
          </p>

          <p style={{
            fontSize: '0.95rem',
            color: '#B8D0E8',
            lineHeight: '1.7',
            marginBottom: '24px'
          }}>
            {course.description}
          </p>

          {/* Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
            padding: '16px 0',
            borderTop: '1px solid #2A4A6B',
            borderBottom: '1px solid #2A4A6B'
          }}>
            {[
              { label: 'Location', value: course.location },
              { label: 'Delivery', value: course.deliveryMode.replace('_', ' ') },
              { label: 'Start Date', value: new Date(course.startDate).toLocaleDateString() },
              { label: 'End Date', value: new Date(course.endDate).toLocaleDateString() },
              { label: 'Deadline', value: new Date(course.applicationDeadline).toLocaleDateString() },
              { label: 'Slots Available', value: `${course.totalSlots - course.filledSlots} of ${course.totalSlots}` },
              { label: 'Target Audience', value: course.targetAudience.replace('_', ' ') },
              { label: 'Gender', value: course.gender }
            ].map((item, i) => (
              <div key={i}>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: '#7A9BB5',
                  marginBottom: '2px'
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Google Form link */}
          {course.googleFormLink && (
            <div style={{
              marginTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 0',
              borderBottom: '1px solid #2A4A6B'
            }}>
              <div>
                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  color: '#F5A623',
                  marginBottom: '2px'
                }}>
                  📎 Document Upload Required
                </p>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#B8D0E8'
                }}>
                  Upload your supporting documents via Google Form
                </p>
              </div>

              <a
                href={course.googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#F5A623',
                  color: '#1E3A5F',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                Upload Documents →
              </a>
            </div>
          )}
          </div>
        </div>

        {/* Application Section */}
        <div style={{
          padding: '8px 0 0'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: '20px'
          }}>
            Apply for this course
          </h2>

          {/* Status messages */}
          {alreadyApplied && !success && (
            <div style={{
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid #F5A623',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#FDF3E0',
              marginBottom: '16px'
            }}>
              You have already applied for this course.
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(245,166,35,0.15)',
              border: '1px solid #F5A623',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#F5A623',
              marginBottom: '16px'
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid #E53E3E',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#FCA5A5',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {isDeadlinePassed && (
            <div style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid #E53E3E',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#FCA5A5',
              marginBottom: '16px'
            }}>
              Application deadline has passed.
            </div>
          )}

          {isFull && (
            <div style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid #E53E3E',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#FCA5A5',
              marginBottom: '16px'
            }}>
              This course is full.
            </div>
          )}

          {/* Application Questions */}
          {canApply && course.applicationQuestions.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              {course.applicationQuestions.map((q, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#B8D0E8',
                    marginBottom: '6px'
                  }}>
                    {q.question}
                    {q.isRequired && (
                      <span style={{ color: '#E53E3E', marginLeft: '4px' }}>*</span>
                    )}
                  </label>

                  {q.fieldType === 'textarea' ? (
                    <textarea
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: '#FFFFFF',
                        background: '#152A47',
                        border: '1px solid #2A4A6B',
                        borderRadius: 'var(--radius)',
                        resize: 'vertical'
                      }}
                    />
                  ) : q.fieldType === 'yes_no' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={(answers[i]?.answer || '').toLowerCase() === 'yes'}
                          onChange={(e) => handleAnswerChange(i, e.target.checked ? 'yes' : '')}
                          style={{ width: '16px', height: '16px', accentColor: '#F5A623', cursor: 'pointer' }}
                        />
                        <span style={{ color: '#B8D0E8', fontSize: '0.85rem', fontWeight: '600' }}>Yes</span>
                      </label>

                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={(answers[i]?.answer || '').toLowerCase() === 'no'}
                          onChange={(e) => handleAnswerChange(i, e.target.checked ? 'no' : '')}
                          style={{ width: '16px', height: '16px', accentColor: '#F5A623', cursor: 'pointer' }}
                        />
                        <span style={{ color: '#B8D0E8', fontSize: '0.85rem', fontWeight: '600' }}>No</span>
                      </label>
                    </div>
                  ) : q.fieldType === 'select' ? (
                    <select
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: '#FFFFFF',
                        background: '#152A47',
                        border: '1px solid #2A4A6B',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <option value="">Select an option</option>
                      {q.options.map((opt, j) => (
                        <option key={j} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : q.fieldType === 'number' ? (
                    <input
                      type="number"
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: '#FFFFFF',
                        background: '#152A47',
                        border: '1px solid #2A4A6B',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                  ) : q.fieldType === 'date' ? (
                    <input
                      type="date"
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: '#FFFFFF',
                        background: '#152A47',
                        border: '1px solid #2A4A6B',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: '#FFFFFF',
                        background: '#152A47',
                        border: '1px solid #2A4A6B',
                        borderRadius: 'var(--radius)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {canApply && (
            <Button
              fullWidth
              loading={applying}
              onClick={handleApply}
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;