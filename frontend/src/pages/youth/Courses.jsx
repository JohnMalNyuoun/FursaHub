import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import { getAllCourses, addCourseComment, toggleCourseReaction } from '../../services/courseService';
import { getMyApplications } from '../../services/applicationService';
import useAuth from '../../hooks/useAuth';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedCourseIds, setAppliedCourseIds] = useState(new Set());
  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentOpen, setCommentOpen] = useState({});
  const [reactingCourseId, setReactingCourseId] = useState('');
  const [commentingCourseId, setCommentingCourseId] = useState('');
  const [filters, setFilters] = useState({ search: '' });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;

      const [coursesRes, appsRes] = await Promise.all([
        getAllCourses(params),
        getMyApplications()
      ]);
      setCourses(coursesRes.data || []);
      setAppliedCourseIds(new Set((appsRes.data || []).map(a => a.course?._id).filter(Boolean)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [filters]);

  const profileImageSrc = useMemo(() => {
    if (!user?.photo) return '';
    const version = user?.updatedAt ? encodeURIComponent(user.updatedAt) : '';
    if (!version) return user.photo;
    const separator = user.photo.includes('?') ? '&' : '?';
    return `${user.photo}${separator}v=${version}`;
  }, [user?.photo, user?.updatedAt]);

  const handleFilter = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const updateEngagement = (courseId, updater) => {
    setCourses(prev => prev.map(c => {
      if (c._id !== courseId) return c;
      const current = c.engagement || { reactionsCount: 0, commentsCount: 0, reactedByMe: false, recentComments: [] };
      return { ...c, engagement: updater(current) };
    }));
  };

  const handleToggleReaction = async (courseId) => {
    setReactingCourseId(courseId);
    try {
      const res = await toggleCourseReaction(courseId);
      const p = res.data;
      updateEngagement(courseId, cur => ({ ...cur, reactedByMe: p.reacted, reactionsCount: p.reactionsCount, commentsCount: p.commentsCount }));
    } catch (err) { console.error(err); }
    finally { setReactingCourseId(''); }
  };

  const handleSubmitComment = async (courseId) => {
    const text = (commentDrafts[courseId] || '').trim();
    if (!text) return;
    setCommentingCourseId(courseId);
    try {
      const res = await addCourseComment(courseId, text);
      const p = res.data;
      updateEngagement(courseId, cur => ({
        ...cur,
        commentsCount: p.commentsCount,
        recentComments: [p.comment, ...(cur.recentComments || [])].slice(0, 3)
      }));
      setCommentDrafts(prev => ({ ...prev, [courseId]: '' }));
      setCommentOpen(prev => ({ ...prev, [courseId]: true }));
    } catch (err) { console.error(err); }
    finally { setCommentingCourseId(''); }
  };

  return (
    <div className="fh-page">
      <Navbar />

      <div className="fh-container" style={{ maxWidth: '840px' }}>

        {/* Header */}
        <div style={{ padding: '20px 0 4px', borderBottom: '1px solid #2A4A6B', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Browse Courses
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Discover courses and opportunities posted by organisations in Kakuma
          </p>
          <p style={{ fontSize: '0.8rem', color: '#93C5FD', marginTop: '4px' }}>
            Active courses only: expired application deadlines are hidden.
          </p>
        </div>

        {/* Search + profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Link
            to="/profile"
            title="Open profile"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            {profileImageSrc ? (
              <img
                src={profileImageSrc}
                alt={user?.fullName || user?.username || 'Profile'}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '999px',
                  objectFit: 'cover',
                  border: '1px solid #2A4A6B'
                }}
              />
            ) : (
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '999px',
                background: '#1A3357',
                border: '1px solid #2A4A6B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F5A623',
                fontSize: '0.95rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {(user?.fullName || user?.username || 'U').charAt(0)}
              </div>
            )}
          </Link>
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            value={filters.search}
            onChange={handleFilter}
            style={{
              flex: 1,
              padding: '12px 14px',
              fontSize: '0.9rem',
              color: '#FFFFFF',
              background: 'transparent',
              border: '1px solid #2A4A6B',
              borderRadius: 'var(--radius)',
              minHeight: '44px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', fontWeight: '600' }}>
          {courses.length} course{courses.length !== 1 ? 's' : ''} found
        </p>

        {/* Feed */}
        {loading ? <Loader /> : courses.length === 0 ? (
          <div className="fh-empty">
            <p style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              No courses found
            </p>
            <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <section>
            {courses.map((course, index) => {
              const eng = course.engagement || { reactionsCount: 0, commentsCount: 0, reactedByMe: false, recentComments: [] };
              const isDeadlinePassed = new Date() > new Date(course.applicationDeadline);
              const isFull = course.filledSlots >= course.totalSlots;
              const alreadyApplied = appliedCourseIds.has(course._id);
              const canApply = !alreadyApplied && !isDeadlinePassed && !isFull;

              return (
                <article key={course._id} style={{
                  padding: '18px 0',
                  borderBottom: index === courses.length - 1 ? 'none' : '1px solid #2A4A6B'
                }}>
                  {/* Org header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {course.organisation?.logo ? (
                      <img src={course.organisation.logo} alt={course.organisation?.name || 'Organisation'}
                        style={{ width: '40px', height: '40px', borderRadius: '999px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '999px',
                        background: '#2A4A6B', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#FFFFFF', fontWeight: 800
                      }}>
                        {(course.organisation?.name || 'O').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/profiles/organisation/${course.organisation?._id}`}
                        style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 800, textDecoration: 'none' }}>
                        {course.organisation?.name || 'Organisation'}
                      </Link>
                      <p style={{ color: '#7A9BB5', fontSize: '0.75rem' }}>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <h2 style={{ color: '#FFFFFF', fontSize: '1.03rem', fontWeight: 800, marginBottom: '8px' }}>
                    {course.title}
                  </h2>

                  <p style={{ color: '#B8D0E8', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '12px' }}>
                    {course.description}
                  </p>

                  {course.coverImage && (
                    <img src={course.coverImage} alt={course.title}
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                      style={{
                        width: '100%', maxHeight: '320px', objectFit: 'cover',
                        borderRadius: '10px', border: '1px solid #2A4A6B', marginBottom: '12px'
                      }} />
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ color: '#7A9BB5', fontSize: '0.78rem' }}>{course.category}</span>
                    <span style={{ color: '#45607D' }}>•</span>
                    <span style={{ color: '#7A9BB5', fontSize: '0.78rem' }}>{course.location}</span>
                    <span style={{ color: '#45607D' }}>•</span>
                    <span style={{ color: '#7A9BB5', fontSize: '0.78rem' }}>
                      Deadline: {new Date(course.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => handleToggleReaction(course._id)}
                      disabled={reactingCourseId === course._id}
                      style={{
                        border: '1px solid #2A4A6B',
                        background: eng.reactedByMe ? 'rgba(245,166,35,0.16)' : 'transparent',
                        color: eng.reactedByMe ? '#F5A623' : '#B8D0E8',
                        borderRadius: '999px', padding: '6px 12px',
                        fontSize: '0.82rem', fontWeight: 700,
                        cursor: reactingCourseId === course._id ? 'not-allowed' : 'pointer',
                        opacity: reactingCourseId === course._id ? 0.7 : 1
                      }}>
                      {eng.reactedByMe ? 'Reacted' : 'React'} ({eng.reactionsCount})
                    </button>

                    <button type="button"
                      onClick={() => setCommentOpen(prev => ({ ...prev, [course._id]: !prev[course._id] }))}
                      style={{
                        border: '1px solid #2A4A6B', background: 'transparent',
                        color: '#B8D0E8', borderRadius: '999px', padding: '6px 12px',
                        fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                      }}>
                      Comment ({eng.commentsCount})
                    </button>

                    {canApply ? (
                      <Link to={`/courses/${course._id}`} style={{
                        background: '#F5A623', color: '#1E3A5F', fontWeight: 800,
                        fontSize: '0.82rem', borderRadius: '999px', padding: '6px 12px', textDecoration: 'none'
                      }}>
                        Apply
                      </Link>
                    ) : (
                      <span style={{
                        border: '1px solid #2A4A6B',
                        color: alreadyApplied ? '#F5A623' : '#7A9BB5',
                        borderRadius: '999px', padding: '6px 12px',
                        fontSize: '0.82rem', fontWeight: 700
                      }}>
                        {alreadyApplied ? 'Applied' : isFull ? 'Full' : 'Closed'}
                      </span>
                    )}

                    <Link to={`/courses/${course._id}`} style={{
                      color: '#F5A623', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none'
                    }}>
                      View Course →
                    </Link>
                  </div>

                  {/* Comment box */}
                  {commentOpen[course._id] && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input type="text" value={commentDrafts[course._id] || ''}
                          onChange={e => setCommentDrafts(prev => ({ ...prev, [course._id]: e.target.value }))}
                          placeholder="Write a comment"
                          style={{
                            flex: 1, background: 'transparent', border: '1px solid #2A4A6B',
                            borderRadius: '8px', color: '#FFFFFF', padding: '8px 10px', fontSize: '0.85rem'
                          }} />
                        <button type="button" onClick={() => handleSubmitComment(course._id)}
                          disabled={commentingCourseId === course._id}
                          style={{
                            border: 'none', background: '#F5A623', color: '#1E3A5F',
                            borderRadius: '8px', padding: '8px 12px', fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: commentingCourseId === course._id ? 'not-allowed' : 'pointer',
                            opacity: commentingCourseId === course._id ? 0.7 : 1
                          }}>
                          Post
                        </button>
                      </div>
                      {(eng.recentComments || []).length > 0 && (
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {eng.recentComments.map(comment => (
                            <div key={comment._id} style={{ borderLeft: '2px solid #2A4A6B', paddingLeft: '10px' }}>
                              <p style={{ color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700 }}>
                                {comment.user?.fullName || 'User'}
                              </p>
                              <p style={{ color: '#B8D0E8', fontSize: '0.84rem', marginTop: '2px' }}>
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default Courses;