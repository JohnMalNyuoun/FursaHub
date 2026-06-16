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
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.9rem',
    color: '#FFFFFF',
    background: '#1A3357',
    border: '1.5px solid #2A4A6B',
    borderRadius: 'var(--radius)',
    minHeight: '44px'
  };

  const searchStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '0.9rem',
    color: '#FFFFFF',
    background: '#152A47',
    border: '1.5px solid #2A4A6B',
    borderRadius: 'var(--radius)',
    minHeight: '44px'
  };

  return (
    <div className="fh-page">
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
            Browse Courses
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#7A9BB5' }}>
            Discover courses and opportunities posted by organisations in Kakuma
          </p>
        </div>
      </div>

      <div className="fh-container">

        {/* Search */}
        <div style={{ marginBottom: '12px', position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            pointerEvents: 'none'
          }}>
            🔍
          </span>
          <input
            type="text"
            name="search"
            placeholder="Search courses..."
            value={filters.search}
            onChange={handleFilter}
            style={{ ...searchStyle, paddingLeft: '40px' }}
          />
        </div>

        {/* Filters */}
        <div className="fh-filters">
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
                padding: '12px 16px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                minHeight: '44px',
                fontWeight: '600'
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          fontWeight: '600'
        }}>
          {courses.length} course{courses.length !== 1 ? 's' : ''} found
        </div>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="fh-empty">
            <div className="fh-empty-icon">🔍</div>
            <p style={{ fontSize: '1rem', marginBottom: '6px', color: 'var(--text-secondary)', fontWeight: '600' }}>
              No courses found
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="fh-card-grid">
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