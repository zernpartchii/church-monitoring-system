
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AddChurch from './church/AddChurch';
import Dashboard from './dashboard/Dashboard';
import ViewAttendance from './attendance/ViewAttendance';
import AccountInfo from './settings/AccountInfo';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/" element={<Login />} />
        <Route path="/cms/login" element={<Login />} />
        <Route path="/cms/register" element={<Register />} />
        <Route path="/cms/add-church" element={<AddChurch />} />
        <Route path="/cms/dashboard" element={<Dashboard />} />
        <Route path="/cms/attendance" element={<ViewAttendance />} />
        <Route path="/cms/settings/account-info" element={<AccountInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
