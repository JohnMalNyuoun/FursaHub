import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchCourses = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/admin/courses', { params });
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filterStatus]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this course?')) return;
    setActionLoading(id);
    try {
      await api.put(`/admin/courses/${id}/cancel`);
      fetchCourses();
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
            All Courses
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Monitor and manage all courses on FursaHub
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
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {courses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p>No courses found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map(course => (
              <div key={course._id} style={{
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
                  marginBottom: '12px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      marginBottom: '2px'
                    }}>
                      {course.title}
                    </h3>
                    <p style={{
                      fontSize: '0.82rem',
                      color: '#F5A623',
                      fontWeight: '600'
                    }}>
                      {course.organisation?.name}
                    </p>
                  </div>

                  <span className={`fh-badge fh-badge-${course.status}`}>
                    {course.status}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📍 {course.location}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    🎓 {course.category}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    👥 {course.filledSlots}/{course.totalSlots} slots
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📅 {new Date(course.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>

                {course.status === 'published' && (
                  <Button
                    variant="danger"
                    loading={actionLoading === course._id}
                    onClick={() => handleCancel(course._id)}
                    style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                  >
                    Cancel Course
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;