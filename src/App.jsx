import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';
import Landing from './pages/Landing';

// Admin Pages
import AdminAuth from './pages/admin/AdminAuth';
import AdminLayout from './components/admin/AdminLayout';
import EmployeeData from './pages/admin/EmployeeData';
import LeaveManagement from './pages/admin/LeaveManagement';
import AddEmployee from './pages/admin/AddEmployee';
import RemoveEmployee from './pages/admin/RemoveEmployee';
import AttendanceReport from './pages/admin/AttendanceReport';
import JobOpenings from './pages/admin/JobOpenings';
import Candidates from './pages/admin/Candidates';
import CandidateDetails from './pages/admin/CandidateDetails';
import Careers from './pages/Careers';
import ApplyJob from './pages/ApplyJob';

// User Pages
import UserAuth from './pages/user/UserAuth';
import UserLayout from './components/user/UserLayout';
import EmployeeInfo from './pages/user/EmployeeInfo';
import ApplyLeave from './pages/user/ApplyLeave';
import LeaveStatus from './pages/user/LeaveStatus';
import MarkAttendance from './pages/user/MarkAttendance';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/admin/signin" element={<AdminAuth />} />
          <Route path="/user/signin" element={<UserAuth />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply/:jobId" element={<ApplyJob />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeData />} />
            <Route path="leave" element={<LeaveManagement />} />
            <Route path="add-employee" element={<AddEmployee />} />
            <Route path="remove-employee" element={<RemoveEmployee />} />
            <Route path="attendance" element={<AttendanceReport />} />
            <Route path="job-openings" element={<JobOpenings />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="candidates/:id" element={<CandidateDetails />} />
          </Route>

          {/* Protected User Routes */}
          <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/user/dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeInfo />} />
            <Route path="apply-leave" element={<ApplyLeave />} />
            <Route path="leave-status" element={<LeaveStatus />} />
            <Route path="attendance" element={<MarkAttendance />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
