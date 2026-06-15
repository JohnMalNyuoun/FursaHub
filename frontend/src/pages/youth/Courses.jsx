import { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import CourseCard from '../../components/youth/CourseCard';
import Loader from '../../components/common/Loader';
import { getAllCourses } from '../../services/courseService';
import { COURSE_CATEGORIES, DELIVERY_MODES, TARGET_AUDIENCES } from '../../utils/constants';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    deliveryMode: '',
    targetAudience: '',
    search: ''
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.deliveryMode) params.deliveryMode = filters.deliveryMode;
      if (filters.targetAudience) params.targetAudience = filters.targetAudience;
      if (filters.search) params.search = filters.search;

      const res = await getAllCourses(params);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: '', deliveryMode: '', targetAudience: '', search: '' });
  };

  const selectStyle = {
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius)',
    minWidth: '150px'
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        padding: '32px 24px'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Browse Courses
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Discover courses and opportunities posted by organisations in Kakuma
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            value={filters.search}
            onChange={handleFilter}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius)',
            }}
          />
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilter}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            {COURSE_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            name="deliveryMode"
            value={filters.deliveryMode}
            onChange={handleFilter}
            style={selectStyle}
          >
            <option value="">All Modes</option>
            {DELIVERY_MODES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select
            name="targetAudience"
            value={filters.targetAudience}
            onChange={handleFilter}
            style={selectStyle}
          >
            <option value="">All Audiences</option>
            {TARGET_AUDIENCES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          {(filters.category || filters.deliveryMode || filters.targetAudience || filters.search) && (
            <button
              onClick={clearFilters}
              style={{
                padding: '10px 16px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Clear filters
            </button>
          )}

          <span style={{
            marginLeft: 'auto',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              No courses found
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {courses.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;