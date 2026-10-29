import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Landing from './pages/public/Landing';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import Program from './pages/public/Program';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentApplications from './pages/student/Applications';
import StudentInternship from './pages/student/Internship';
import StudentNotifications from './pages/student/Notifications';

import MentorDashboard from './pages/mentor/Dashboard';
import MentorInterns from './pages/mentor/Interns';
import MentorReviews from './pages/mentor/Reviews';
import MentorApplications from './pages/mentor/Applications';
import MentorProjects from './pages/mentor/Projects';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProjects from './pages/admin/Projects';
import AdminApplications from './pages/admin/Applications';
import AdminAnalytics from './pages/admin/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/program" element={<Program />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/applications" element={<StudentApplications />} />
              <Route path="/student/internship" element={<StudentInternship />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
            </Route>
          </Route>

          {/* Mentor */}
          <Route element={<ProtectedRoute roles={['mentor']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/mentor/interns" element={<MentorInterns />} />
              <Route path="/mentor/reviews" element={<MentorReviews />} />
              <Route path="/mentor/applications" element={<MentorApplications />} />
              <Route path="/mentor/projects" element={<MentorProjects />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>
          </Route>

          <Route path="*" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
