import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

// Auth pages
import YouthLogin from './pages/auth/YouthLogin';
import YouthRegister from './pages/auth/YouthRegister';
import OrgLogin from './pages/auth/OrgLogin';
import OrgRegister from './pages/auth/OrgRegister';

// Youth pages
import YouthHome from './pages/youth/Home';
import YouthCourses from './pages/youth/Courses';
import CourseDetail from './pages/youth/CourseDetail';
import YouthApplications from './pages/youth/Applications';
import YouthNotifications from './pages/youth/Notifications';
import YouthProfile from './pages/youth/Profile';
import YouthSettings from './pages/youth/Settings';
import Preferences from './pages/youth/Preferences';

// Organisation pages
import OrgDashboard from './pages/organisation/Dashboard';
import CourseAnalytics from './pages/organisation/CourseAnalytics';
import OrgCourses from './pages/organisation/Courses';
import OrgCourseForm from './pages/organisation/CourseForm';
import OrgApplications from './pages/organisation/Applications';
import OrgProfile from './pages/organisation/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrganisations from './pages/admin/Organisations';
import AdminCourses from './pages/admin/Courses';
import AdminUsers from './pages/admin/Users';
import Landing from './pages/Landing';
import Impact from './pages/organisation/Impact';
import CourseOutcomes from './pages/organisation/CourseOutcomes';
import OutcomeForm from './pages/youth/OutcomeForm';
import Loader from './components/common/Loader';
import PublicYouthProfile from './pages/common/PublicYouthProfile';
import PublicOrganisationProfile from './pages/common/PublicOrganisationProfile';
// Route guards 
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const YouthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'youth') return <Navigate to="/login" />;
  return children;
};

const OrgRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/org/login" />;
  if (user.role !== 'organisation') return <Navigate to="/org/login" />;
  return children;
};


const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/login" />;
  return children;
};
function App () {
  return (
    <Routes>
      {/* Public */}

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<YouthLogin />} />
      <Route path="/register" element={<YouthRegister />} />
      <Route path="/org/login" element={<OrgLogin />} />
      <Route path="/org/register" element={<OrgRegister />} />

      {/* Shared profiles */}
      <Route path="/profiles/youth/:id" element={<AuthRoute><PublicYouthProfile /></AuthRoute>} />
      <Route path="/profiles/organisation/:id" element={<AuthRoute><PublicOrganisationProfile /></AuthRoute>} />

      {/* Youth */}
      <Route path="/home" element={<YouthRoute><YouthHome /></YouthRoute>} />
      <Route path="/courses" element={<YouthRoute><YouthCourses /></YouthRoute>} />
      <Route path="/courses/:id" element={<YouthRoute><CourseDetail /></YouthRoute>} />
      <Route path="/applications" element={<YouthRoute><YouthApplications /></YouthRoute>} />
      <Route path="/notifications" element={<YouthRoute><YouthNotifications /></YouthRoute>} />
      <Route path="/profile" element={<YouthRoute><YouthProfile /></YouthRoute>} />
      <Route path="/youth/profile" element={<YouthRoute><YouthProfile /></YouthRoute>} />
      <Route path="/settings" element={<YouthRoute><YouthSettings /></YouthRoute>} />
      <Route path="/youth/settings" element={<YouthRoute><YouthSettings /></YouthRoute>} />
      <Route path="/preferences" element={<YouthRoute><Preferences /></YouthRoute>} />
      <Route path="/youth/preferences" element={<YouthRoute><Preferences /></YouthRoute>} />

      {/* Organisation */}
      <Route path="/org/dashboard" element={<OrgRoute><OrgDashboard /></OrgRoute>} />
      <Route path="/org/analytics" element={<OrgRoute><CourseAnalytics /></OrgRoute>} />
      <Route path="/org/courses" element={<OrgRoute><OrgCourses /></OrgRoute>} />
      <Route path="/org/courses/new" element={<OrgRoute><OrgCourseForm /></OrgRoute>} />
      <Route path="/org/applications" element={<OrgRoute><OrgApplications /></OrgRoute>} />
      <Route path="/org/profile" element={<OrgRoute><OrgProfile /></OrgRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/organisations" element={<AdminRoute><AdminOrganisations /></AdminRoute>} />
      <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      {/* Organisation impact */}
<Route path="/org/impact" element={<OrgRoute><Impact /></OrgRoute>} />
<Route path="/org/courses/:id/outcomes" element={<OrgRoute><CourseOutcomes /></OrgRoute>} />

{/* Youth outcome form */}
<Route path="/outcomes" element={<YouthRoute><OutcomeForm /></YouthRoute>} />
    </Routes>
  );
}

export default App;