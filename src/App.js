import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Tutors from './pages/Tutors';
import Apply from './pages/Apply';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TutorManagement from './pages/admin/TutorManagement';
import StudentManagement from './pages/admin/StudentManagement';
import SessionManagement from './pages/admin/SessionManagement';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/tutors" element={<Tutors />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tutors" 
          element={
            <ProtectedRoute requiredRole="admin">
              <TutorManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute requiredRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/sessions" 
          element={
            <ProtectedRoute requiredRole="admin">
              <SessionManagement />
            </ProtectedRoute>
          } 
        />

        {/* Tutor Routes */}
        <Route 
          path="/tutor/dashboard" 
          element={
            <ProtectedRoute requiredRole="tutor">
              <TutorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirect /admin and /tutor to their dashboards */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/tutor" element={<Navigate to="/tutor/dashboard" replace />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
