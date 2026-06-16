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

  const groupedCourses = {
    published: courses.filter((course) => course.status === 'published'),
    draft: courses.filter((course) => course.status === 'draft'),
    closed: courses.filter((course) => course.status === 'closed' || course.status === 'cancelled')
  };

  const sectionConfig = [
    {
      key: 'published',
      title: 'Published Courses',
      description: 'Visible to youth and currently accepting applications.',
      items: groupedCourses.published
    },
    {
      key: 'draft',
      title: 'Draft Courses',
      description: 'Not yet visible to youth. Publish when ready.',
      items: groupedCourses.draft
    },
    {
      key: 'closed',
      title: 'Closed Courses',
      description: 'Ended or manually closed courses.',
      items: groupedCourses.closed
    }
  ];

  if (loading) return <Loader />;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div className="fh-section-head">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '4px'
            }}>
              Your Courses
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
              Manage all your posted courses
            </p>
          </div>
          <Link to="/org/courses/new" className="fh-mobile-full" style={{ display: 'inline-block' }}>
            <Button className="fh-mobile-full">+ Post New Course</Button>
          </Link>
        </div>
      </div>

      <div className="fh-container">
        {courses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: '#7A9BB5'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
              No courses posted yet
            </p>
            <Link to="/org/courses/new">
              <Button>Post Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sectionConfig.map((section) => {
              if (section.items.length === 0) return null;

              return (
                <section key={section.key}>
                  <div style={{ marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                      {section.title}
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#7A9BB5' }}>
                      {section.description}
                    </p>
                  </div>

                  <div className="fh-card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {section.items.map((course) => {
                      const cardImage = (course.coverImage || '').replace('http://', 'https://');
                      return (
                        <div key={course._id} style={{
                          background: '#1A3357',
                          border: '1px solid #2A4A6B',
                          borderRadius: '16px',
                          padding: cardImage ? '0 0 18px' : '18px',
                          overflow: 'hidden',
                          boxShadow: 'var(--card-shadow)'
                        }}>
                          {cardImage ? (
                            <img
                              src={cardImage}
                              alt={course.title}
                              style={{
                                width: '100%',
                                height: '165px',
                                objectFit: 'cover',
                                display: 'block',
                                borderBottom: '1px solid #2A4A6B',
                                marginBottom: '16px'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '140px',
                              background: 'linear-gradient(135deg, #122845 0%, #1E3A5F 60%, #2B527E 100%)',
                              borderBottom: '1px solid #2A4A6B',
                              marginBottom: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#B8D0E8',
                              fontSize: '0.85rem',
                              fontWeight: '700'
                            }}>
                              No cover image
                            </div>
                          )}

                          <div style={{ padding: cardImage ? '0 16px' : 0 }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '10px',
                              marginBottom: '10px'
                            }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.3 }}>
                                {course.title}
                              </h3>
                              <span className={`fh-badge fh-badge-${course.status}`}>
                                {course.status}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#7A9BB5', marginBottom: '12px' }}>
                              {course.category} · {course.deliveryMode.replace('_', ' ')} · {course.location}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#7A9BB5' }}>
                                👥 {course.filledSlots}/{course.totalSlots} slots filled
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#7A9BB5' }}>
                                📅 Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {course.status === 'draft' && (
                                <>
                                  <Button
                                    loading={actionLoading === course._id + '_publish'}
                                    onClick={() => handlePublish(course._id)}
                                    style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                                  >
                                    Publish
                                  </Button>
                                  <Button
                                    variant="danger"
                                    loading={actionLoading === course._id + '_delete'}
                                    onClick={() => handleDelete(course._id)}
                                    style={{ fontSize: '0.8rem', padding: '8px 12px' }}
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
                                  style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                                >
                                  Close Course
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;