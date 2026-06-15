import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import {
  getOrgCourses,
  publishCourse,
  closeCourse,
  deleteCourse
} from '../../services/courseService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await getOrgCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handlePublish = async (id) => {
    setActionLoading(id + '_publish');
    try {
      await publishCourse(id);
      fetchCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (id) => {
    if (!window.confirm('Close this course? Youth will no longer be able to apply.')) return;
    setActionLoading(id + '_close');
    try {
      await closeCourse(id);
      fetchCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    setActionLoading(id + '_delete');
    try {
      await deleteCourse(id);
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

      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '32px 24px'
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              marginBottom: '4px'
            }}>
              Your Courses
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Manage all your posted courses
            </p>
          </div>
          <Link to="/org/courses/new">
            <Button>+ Post New Course</Button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        {courses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
              No courses posted yet
            </p>
            <Link to="/org/courses/new">
              <Button>Post Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {courses.map(course => (
              <div key={course._id} style={{
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
                      {course.title}
                    </h3>
                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)'
                    }}>
                      {course.category} · {course.deliveryMode.replace('_', ' ')} · {course.location}
                    </p>
                  </div>

                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    background: course.status === 'published'
                      ? '#F0FFF4' : course.status === 'closed'
                      ? '#FFF5F5' : course.status === 'cancelled'
                      ? '#FFF5F5' : 'var(--bg-section-alt)',
                    color: course.status === 'published'
                      ? '#276749' : course.status === 'closed' || course.status === 'cancelled'
                      ? '#C53030' : 'var(--text-secondary)'
                  }}>
                    {course.status}
                  </span>
                </div>

                {/* Slots */}
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    👥 {course.filledSlots}/{course.totalSlots} slots filled
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📅 Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {course.status === 'draft' && (
                    <>
                      <Button
                        loading={actionLoading === course._id + '_publish'}
                        onClick={() => handlePublish(course._id)}
                        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                      >
                        Publish
                      </Button>
                      <Button
                        variant="danger"
                        loading={actionLoading === course._id + '_delete'}
                        onClick={() => handleDelete(course._id)}
                        style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {course.status === 'published' && (
                    <Button
                      variant="outline"
                      loading={actionLoading === course._id + '_close'}
                      onClick={() => handleClose(course._id)}
                      style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    >
                      Close Course
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;