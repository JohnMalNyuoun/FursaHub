import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { createCourse } from '../../services/courseService';
import {
  COURSE_CATEGORIES,
  DELIVERY_MODES,
  TARGET_AUDIENCES
} from '../../utils/constants';

const CourseForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    gender: 'both',
    location: 'Kakuma',
    deliveryMode: '',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    totalSlots: '',
    googleFormLink: '',
    coverImage: null
  });

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    return () => {
      if (coverPreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      const nextFile = files?.[0] || null;

      setForm((current) => ({ ...current, [name]: nextFile }));
      setCoverPreview((current) => {
        if (current.startsWith('blob:')) {
          URL.revokeObjectURL(current);
        }
        return nextFile ? URL.createObjectURL(nextFile) : '';
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const buildPayload = () => {
    const payload = new FormData();
    const cleanedQuestions = questions.filter((q) => q.question?.trim());
    const fields = {
      ...form,
      totalSlots: String(parseInt(form.totalSlots, 10)),
      googleFormLink: form.googleFormLink?.trim() || ''
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (key === 'coverImage') return;
      if (value !== '' && value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    payload.append('applicationQuestions', JSON.stringify(cleanedQuestions));

    if (form.coverImage) {
      payload.append('coverImage', form.coverImage);
    }

    return payload;
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      fieldType: 'textarea',
      isRequired: true,
      options: []
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createCourse(buildPayload());
      navigate('/org/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: '#FFFFFF',
    background: '#152A47',
    border: '1px solid #2A4A6B',
    borderRadius: 'var(--radius)',
    marginBottom: '16px'
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

        <button
          onClick={() => navigate('/org/courses')}
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

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '8px'
        }}>
          Post a New Course
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#7A9BB5',
          marginBottom: '32px'
        }}>
          Fill in the details below. You can save as draft and publish later.
        </p>

        {error && (
          <div style={{
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid #E53E3E',
            borderRadius: 'var(--radius)',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Basic Info */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Basic Information
            </h2>

            <Input
              label="Course Title"
              name="title"
              placeholder="e.g. Full Stack Web Development"
              value={form.title}
              onChange={handleChange}
              required
            />

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the course, what youth will learn, and any prerequisites"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
              />
            </div>

            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select category</option>
              {COURSE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <div style={{ marginTop: '4px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Course Cover Image (Optional)
              </label>
              <input
                type="file"
                name="coverImage"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius)',
                  marginBottom: coverPreview ? '12px' : '8px'
                }}
              />
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                marginBottom: coverPreview ? '12px' : '0'
              }}>
                Upload a JPG, PNG, or WEBP image. It will be stored in Cloudinary and shown on the course.
              </p>

              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Course cover preview"
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border-color)'
                  }}
                />
              )}
            </div>
          </div>

          {/* Targeting */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Target Audience
            </h2>

            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Who is this course for?
            </label>
            <select
              name="targetAudience"
              value={form.targetAudience}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select audience</option>
              {TARGET_AUDIENCES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="both">All Genders</option>
              <option value="female">Female Only</option>
              <option value="male">Male Only</option>
            </select>
          </div>

          {/* Logistics */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '20px'
            }}>
              Logistics
            </h2>

            <Input
              label="Location"
              name="location"
              placeholder="e.g. SIR Centre, Kakuma"
              value={form.location}
              onChange={handleChange}
              required
            />

            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Delivery Mode
            </label>
            <select
              name="deliveryMode"
              value={form.deliveryMode}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Select mode</option>
              {DELIVERY_MODES.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Application Deadline"
              type="date"
              name="applicationDeadline"
              value={form.applicationDeadline}
              onChange={handleChange}
              required
            />

            <Input
              label="Total Slots"
              type="number"
              name="totalSlots"
              placeholder="e.g. 20"
              value={form.totalSlots}
              onChange={handleChange}
              required
            />

            <Input
              label="Google Form Link (Optional)"
              type="url"
              name="googleFormLink"
              placeholder="https://docs.google.com/forms/..."
              value={form.googleFormLink}
              onChange={handleChange}
            />

            <p style={{
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginTop: '-8px'
            }}>
              Add the Google Form URL here if applicants should upload CVs, certificates, or extra documents.
            </p>
          </div>

          {/* Application Questions */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '4px'
                }}>
                  Application Questions
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {questions.length} question{questions.length !== 1 ? 's' : ''} added
                </p>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: 'rgba(245,166,35,0.15)',
                  color: '#F5A623',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '24px',
                border: '1px dashed #2A4A6B',
                borderRadius: 'var(--radius)'
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#7A9BB5',
                  marginBottom: '14px'
                }}>
                  No questions added yet
                </p>
                <button
                  type="button"
                  onClick={addQuestion}
                  style={{
                    background: 'rgba(245,166,35,0.15)',
                    color: '#F5A623',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '9px 14px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Add Your First Question
                </button>
              </div>
            ) : (
              <>
                {questions.map((q, i) => (
                  <div key={i} style={{
                    background: '#152A47',
                    border: '1px solid #2A4A6B',
                    borderRadius: 'var(--radius)',
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: '#7A9BB5'
                      }}>
                        Question {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#E53E3E',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          fontWeight: '700'
                        }}
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Type your question here"
                      value={q.question}
                      onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        background: 'var(--bg-card)',
                        border: '1.5px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '10px'
                      }}
                    />

                    <div style={{ marginBottom: q.fieldType === 'select' ? '10px' : '12px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#7A9BB5',
                        marginBottom: '6px'
                      }}>
                        Answer Type
                      </label>
                      <select
                        value={q.fieldType}
                        onChange={(e) => updateQuestion(i, 'fieldType', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          background: 'var(--bg-card)',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <option value="textarea">Long text answer</option>
                        <option value="text">Short text answer</option>
                        <option value="yes_no">Yes / No</option>
                        <option value="select">Multiple choice</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    {q.fieldType === 'select' && (
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#7A9BB5',
                          marginBottom: '6px'
                        }}>
                          Options (one per line)
                        </label>
                        <textarea
                          placeholder={'Option 1\nOption 2\nOption 3'}
                          value={(q.options || []).join('\n')}
                          onChange={(e) => updateQuestion(
                            i,
                            'options',
                            e.target.value.split('\n').filter(o => o.trim())
                          )}
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
                            fontSize: '0.9rem',
                            color: 'var(--text-primary)',
                            background: 'var(--bg-card)',
                            border: '1.5px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    )}

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.84rem',
                      color: '#B8D0E8',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={q.isRequired}
                        onChange={(e) => updateQuestion(i, 'isRequired', e.target.checked)}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Required question
                    </label>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addQuestion}
                  style={{
                    background: 'rgba(245,166,35,0.15)',
                    color: '#F5A623',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '9px 14px',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  + Add Another Question
                </button>
              </>
            )}
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Save as Draft
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;