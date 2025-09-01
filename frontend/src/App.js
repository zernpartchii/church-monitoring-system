
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import AddChurch from './church/AddChurch';
import Dashboard from './dashboard/Dashboard';
import ViewAttendance from './attendance/ViewAttendance';
import AccountInfo from './settings/AccountInfo';
import Schedule from './schedule/Schedule';
import NotificationPage from './notification/NotificationPage';
//Import Admin component
import AdminDashboard from './admin/Dashboard';
import ViewRequest from './admin/viewRequest/ViewRequest';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/cms/login" element={<Login />} />
        <Route path="/cms/register" element={<Register />} />
        {/* Private Routes */}
        <Route element={<Layout />}>
          <Route path="/cms/add-church" element={<AddChurch />} />
          <Route path="/cms/dashboard" element={<Dashboard />} />
          <Route path="/cms/attendance" element={<ViewAttendance />} />
          <Route path="/cms/schedule" element={<Schedule />} />
          <Route path="/cms/settings/account-info" element={<AccountInfo />} />
          <Route path="/cms/notifications" element={<NotificationPage />} />

          {/* Admin Routes */}
          <Route path="/cms/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/cms/admin/view-request" element={<ViewRequest />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
