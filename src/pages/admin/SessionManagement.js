import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import SessionCalendar from '../../components/admin/SessionCalendar';
import SessionForm from '../../components/admin/SessionForm';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import { formatDateTime, formatDuration } from '../../utils/dateHelpers';
import { FaPlus, FaChalkboardTeacher, FaUserGraduate, FaCalendarAlt, FaHome, FaCalendarCheck, FaList } from 'react-icons/fa';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewingSession, setViewingSession] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');
  const [filters, setFilters] = useState({
    tutor: '',
    student: '',
    subject: '',
  });
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [sessionsResult, tutorsResult, studentsResult] = await Promise.all([
        supabase.from('sessions').select('*').order('date', { ascending: true }).order('start_time'),
        supabase.from('tutors').select('id, name, subjects').eq('is_active', true).order('name'),
        supabase.from('students').select('id, first_name, last_name').order('first_name'),
      ]);

      if (sessionsResult.error) throw sessionsResult.error;
      if (tutorsResult.error) throw tutorsResult.error;
      if (studentsResult.error) throw studentsResult.error;

      setSessions(sessionsResult.data || []);
      setTutors(tutorsResult.data || []);
      setStudents(studentsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = () => {
    setSelectedSession(null);
    setShowModal(true);
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setViewingSession(null);
    setShowModal(true);
  };

  const handleViewSession = (event) => {
    const session = event.resource;
    setViewingSession(session);
  };

  const handleDeleteSession = (session) => {
    setDeleteConfirm(session);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', deleteConfirm.id);

      if (error) throw error;
      showAlert('success', 'Session deleted successfully');
      fetchAllData();
      setViewingSession(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      showAlert('error', 'Failed to delete session');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedSession(null);
    showAlert('success', message);
    fetchAllData();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    if (filters.tutor && session.tutor_id !== filters.tutor) return false;
    if (filters.student && session.student_id !== filters.student) return false;
    if (filters.subject && !session.subject.toLowerCase().includes(filters.subject.toLowerCase())) return false;
    return true;
  });

  const getTutorName = (tutorId) => {
    return tutors.find(t => t.id === tutorId)?.name || 'Unknown';
  };

  const getStudentName = (studentId) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 sm:space-x-8 lg:space-x-12 overflow-x-auto">
              <Link to="/admin/dashboard" className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-purple to-primary-navy bg-clip-text text-transparent whitespace-nowrap flex items-center gap-2">
                <FaHome className="text-primary-navy text-base sm:text-lg" />
                <span className="hidden sm:inline">LearnGevity Admin</span>
              </Link>
              <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
                <Link to="/admin/tutors" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm whitespace-nowrap">
                  <FaChalkboardTeacher />
                  <span>Tutors</span>
                </Link>
                <Link to="/admin/students" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-xs sm:text-sm whitespace-nowrap">
                  <FaUserGraduate />
                  <span>Students</span>
                </Link>
                <Link to="/admin/sessions" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 rounded-lg bg-gradient-to-r from-primary-navy to-primary-navy/80 text-white font-semibold text-xs sm:text-sm whitespace-nowrap">
                  <FaCalendarAlt />
                  <span>Sessions</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-1.5 bg-primary-purple/10 text-primary-purple px-3 py-2 rounded-lg hover:bg-primary-purple/20 transition-colors text-xs font-semibold whitespace-nowrap border border-primary-purple/20"
                title="View Public Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden md:inline">Website</span>
              </Link>
              <span className="text-gray-700 text-xs truncate max-w-[100px] sm:max-w-none hidden sm:inline">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-1">
              Session Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Schedule and manage tutoring sessions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
              className="bg-white text-primary-navy px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 border-2 border-primary-navy whitespace-nowrap"
            >
              {viewMode === 'calendar' ? <FaList /> : <FaCalendarCheck />}
              <span className="hidden sm:inline">{viewMode === 'calendar' ? 'List' : 'Calendar'}</span>
            </button>
            <button
              onClick={handleAddSession}
              className="bg-gradient-to-r from-primary-navy to-primary-navy/80 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              <FaPlus className="text-sm" />
              <span>New Session</span>
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              autoClose={true}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <FaList className="text-primary-purple" />
              Filter Sessions
            </h3>
            <button
              onClick={() => setFilters({ tutor: '', student: '', subject: '' })}
              className="text-sm text-primary-purple hover:text-primary-navy font-semibold"
            >
              Clear All
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={filters.tutor}
              onChange={(e) => setFilters(prev => ({ ...prev, tutor: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
            >
              <option value="">All Tutors</option>
              {tutors.map(tutor => (
                <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
              ))}
            </select>

            <select
              value={filters.student}
              onChange={(e) => setFilters(prev => ({ ...prev, student: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
            >
              <option value="">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter by subject..."
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
            />
          </div>
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sessions...</p>
          </div>
        ) : (
          <SessionCalendar
            sessions={filteredSessions}
            tutors={tutors}
            students={students}
            onSelectEvent={handleViewSession}
            onSelectSlot={(slotInfo) => {
              // Could pre-fill form with selected date/time
              handleAddSession();
            }}
          />
        )}
      </div>

      {/* Add/Edit Session Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSession(null);
        }}
        title={selectedSession ? 'Edit Session' : 'Create New Session'}
        size="lg"
      >
        <SessionForm
          session={selectedSession}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowModal(false);
            setSelectedSession(null);
          }}
        />
      </Modal>

      {/* View Session Details Modal */}
      <Modal
        isOpen={!!viewingSession}
        onClose={() => setViewingSession(null)}
        title="Session Details"
        size="md"
      >
        {viewingSession && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tutor</label>
                <p className="text-gray-900">{getTutorName(viewingSession.tutor_id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Student</label>
                <p className="text-gray-900">{getStudentName(viewingSession.student_id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{viewingSession.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  viewingSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                  viewingSession.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {viewingSession.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date & Time</label>
                <p className="text-gray-900">{formatDateTime(viewingSession.date, viewingSession.start_time)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">{formatDuration(viewingSession.duration)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900 capitalize">{viewingSession.session_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery</label>
                <p className="text-gray-900 capitalize">{viewingSession.delivery_mode}</p>
              </div>
            </div>

            {viewingSession.meeting_link && (
              <div>
                <label className="text-sm font-medium text-gray-500">Meeting Link</label>
                <a href={viewingSession.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary-purple hover:underline block">
                  {viewingSession.meeting_link}
                </a>
              </div>
            )}

            {viewingSession.location && (
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{viewingSession.location}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => handleEditSession(viewingSession)}
                className="flex-1 bg-primary-purple text-white py-2 rounded-lg font-semibold hover:bg-opacity-90"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSession(viewingSession)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Session"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this session? This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SessionManagement;

