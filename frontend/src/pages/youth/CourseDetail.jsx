import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
            color: 'var(--green-primary)',
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
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            background: 'var(--green-mint)',
            color: 'var(--green-deep)',
            marginBottom: '16px'
          }}>
            {course.category}
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            {course.title}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--green-primary)',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            {course.organisation?.name} · {course.organisation?.type}
          </p>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
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
            padding: '20px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius)'
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
                  color: 'var(--text-muted)',
                  marginBottom: '2px'
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Section */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          padding: '32px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Apply for this course
          </h2>

          {/* Status messages */}
          {alreadyApplied && !success && (
            <div style={{
              background: '#EBF8FF',
              border: '1px solid #BEE3F8',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#2C5282',
              marginBottom: '16px'
            }}>
              You have already applied for this course.
            </div>
          )}

          {success && (
            <div style={{
              background: '#F0FFF4',
              border: '1px solid #9AE6B4',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#276749',
              marginBottom: '16px'
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{
              background: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#C53030',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {isDeadlinePassed && (
            <div style={{
              background: '#FFFAF0',
              border: '1px solid #FAD08A',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#744210',
              marginBottom: '16px'
            }}>
              Application deadline has passed.
            </div>
          )}

          {isFull && (
            <div style={{
              background: '#FFF5F5',
              border: '1px solid #FEB2B2',
              borderRadius: 'var(--radius)',
              padding: '12px',
              fontSize: '0.9rem',
              color: '#C53030',
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
                    color: 'var(--text-secondary)',
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
                        color: 'var(--text-primary)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        resize: 'vertical'
                      }}
                    />
                  ) : q.fieldType === 'yes_no' ? (
                    <select
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : q.fieldType === 'select' ? (
                    <select
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      <option value="">Select an option</option>
                      {q.options.map((opt, j) => (
                        <option key={j} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={answers[i]?.answer || ''}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: '0.95rem',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
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