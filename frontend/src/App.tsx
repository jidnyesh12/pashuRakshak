
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UserDashboard from './pages/dashboards/UserDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import NgoDashboard from './pages/dashboards/NgoDashboard';
import WorkerDashboard from './pages/dashboards/WorkerDashboard';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import NgoManagement from './pages/NgoManagement';
import ReportAnimal from './pages/ReportAnimal';
import TrackReport from './pages/TrackReport';
import Emergency from './pages/Emergency';
import ManageNgo from './pages/ManageNgo';
import Unauthorized from './pages/Unauthorized';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* User Dashboard */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute requiredRole="USER">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* NGO Dashboard */}
            <Route
              path="/ngo/dashboard"
              element={
                <ProtectedRoute requiredRole="NGO">
                  <NgoDashboard />
                </ProtectedRoute>
              }
            />

            {/* NGO Worker Dashboard */}
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute requiredRole="NGO_WORKER">
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Management Routes */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <UserManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/ngos"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <NgoManagement />
                </ProtectedRoute>
              }
            />

            {/* Public Report Routes */}
            <Route path="/report-animal" element={<ReportAnimal />} />
            <Route path="/track-report" element={<TrackReport />} />
            <Route path="/emergency" element={<Emergency />} />

            {/* NGO Management Route */}
            <Route
              path="/manage-ngo"
              element={
                <ProtectedRoute requiredRole="NGO">
                  <ManageNgo />
                </ProtectedRoute>
              }
            />

            {/* Redirect /dashboard based on user role */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigate to="/user/dashboard" replace />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized page */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
