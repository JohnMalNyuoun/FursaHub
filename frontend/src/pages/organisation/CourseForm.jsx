import { useState } from 'react';
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
  });

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      await createCourse({
        ...form,
        totalSlots: parseInt(form.totalSlots),
        applicationQuestions: questions
      });
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
    color: 'var(--text-primary)',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
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

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Post a New Course
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginBottom: '32px'
        }}>
          Fill in the details below. You can save as draft and publish later.
        </p>

        {error && (
          <div style={{
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: 'var(--radius)',
            padding: '12px',
            marginBottom: '24px',
            fontSize: '0.9rem',
            color: '#C53030'
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
                  Add questions youth must answer when applying
                </p>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: 'var(--green-mint)',
                  color: 'var(--green-deep)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '20px'
              }}>
                No questions added yet. Click "Add Question" to add one.
              </p>
            ) : (
              questions.map((q, i) => (
                <div key={i} style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
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
                      fontWeight: '600',
                      color: 'var(--text-muted)'
                    }}>
                      Question {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(i)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C53030',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={q.question}
                    onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius)',
                      marginBottom: '10px'
                    }}
                  />

                  <select
                    value={q.fieldType}
                    onChange={(e) => updateQuestion(i, 'fieldType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius)'
                    }}
                  >
                    <option value="textarea">Long text</option>
                    <option value="text">Short text</option>
                    <option value="yes_no">Yes / No</option>
                    <option value="select">Multiple choice</option>
                  </select>
                </div>
              ))
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