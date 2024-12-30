import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import PlaceBidPage from './pages/PlaceBidPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />

            {/* Employer routes */}
            <Route
              path="/employer/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.EMPLOYER]}>
                  <EmployerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={[UserRole.EMPLOYER]}>
                  <PostJobPage />
                </ProtectedRoute>
              }
            />

            {/* Applicant routes */}
            <Route
              path="/applicant/dashboard"
              element={
                <ProtectedRoute allowedRoles={[UserRole.APPLICANT]}>
                  <ApplicantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id/bid"
              element={
                <ProtectedRoute allowedRoles={[UserRole.APPLICANT]}>
                  <PlaceBidPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;