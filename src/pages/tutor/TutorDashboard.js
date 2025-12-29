import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import MySchedule from '../../components/tutor/MySchedule';
import AvailabilityManager from '../../components/tutor/AvailabilityManager';
import Modal from '../../components/Modal';
import { formatDateTime, formatDuration } from '../../utils/dateHelpers';
import { FaCalendarCheck, FaCheckCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingSession, setViewingSession] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [stats, setStats] = useState({
    scheduled: 0,
    completed: 0,
    totalHours: 0,
  });

  useEffect(() => {
    if (user) {
      fetchTutorData();
    }
  }, [user]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);

      // Get tutor profile
      const { data: tutorData, error: tutorError } = await supabase
        .from('tutors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (tutorError) throw tutorError;
      setTutorProfile(tutorData);

      // Get tutor's sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('tutor_id', tutorData.id)
        .order('date')
        .order('start_time');

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Get unique student IDs
      const studentIds = [...new Set(sessionsData.map(s => s.student_id))];

      // Fetch students
      if (studentIds.length > 0) {
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('id, first_name, last_name')
          .in('id', studentIds);

        if (studentsError) throw studentsError;
        setStudents(studentsData || []);
      }

      // Calculate stats for this week
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const thisWeekSessions = sessionsData.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      const scheduled = thisWeekSessions.filter(s => s.status === 'scheduled').length;
      const completed = thisWeekSessions.filter(s => s.status === 'completed').length;
      const totalMinutes = thisWeekSessions
        .filter(s => s.status !== 'cancelled')
        .reduce((sum, s) => sum + s.duration, 0);

      setStats({
        scheduled,
        completed,
        totalHours: (totalMinutes / 60).toFixed(1),
      });
    } catch (error) {
      console.error('Error fetching tutor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewSession = (event) => {
    const session = event.resource;
    setViewingSession(session);
  };

  const handleMarkComplete = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      setViewingSession(null);
      fetchTutorData(); // Refresh data
    } catch (error) {
      console.error('Error marking session complete:', error);
      alert('Failed to mark session as complete');
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-[#061027]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-purple mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/tutor/dashboard" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-purple to-primary-navy bg-clip-text text-transparent">
                LearnGevity Tutor
              </Link>
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
              <span className="text-gray-700 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                {tutorProfile?.name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-red-600 text-xs sm:text-sm transition-colors"
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
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-2">
            Welcome, {tutorProfile?.name || 'Tutor'}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Here's an overview of your tutoring sessions this week.
          </p>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Scheduled */}
          <div className="bg-gradient-to-br from-primary-purple to-primary-purple/80 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <FaCalendarCheck className="text-3xl opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.scheduled}</div>
            <div className="text-sm opacity-90">Scheduled This Week</div>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <FaCheckCircle className="text-3xl opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.completed}</div>
            <div className="text-sm opacity-90">Completed This Week</div>
          </div>

          {/* Total Hours */}
          <div className="bg-gradient-to-br from-primary-orange to-primary-orange/80 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <FaClock className="text-3xl opacity-80" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold mb-1">{stats.totalHours}h</div>
            <div className="text-sm opacity-90">Total Hours This Week</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowAvailability(!showAvailability)}
            className="bg-gradient-to-r from-primary-purple to-primary-navy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <FaCalendarAlt className="text-lg" />
            {showAvailability ? 'Hide' : 'Manage'} Availability
          </button>
        </div>

        {/* Availability Manager */}
        {showAvailability && tutorProfile && (
          <div className="mb-8">
            <AvailabilityManager tutorId={tutorProfile.id} />
          </div>
        )}

        {/* My Schedule */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary-navy mb-4">My Schedule</h2>
          {sessions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-700 font-semibold">No sessions scheduled yet</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for your upcoming tutoring sessions</p>
            </div>
          ) : (
            <MySchedule
              sessions={sessions}
              students={students}
              onSelectEvent={handleViewSession}
            />
          )}
        </div>
      </div>

      {/* View Session Details Modal */}
      <Modal
        isOpen={!!viewingSession}
        onClose={() => setViewingSession(null)}
        title="Session Details"
        size="md"
      >
        {viewingSession && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</label>
                <p className="text-gray-900 font-medium mt-1">{getStudentName(viewingSession.student_id)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</label>
                <p className="text-gray-900 font-medium mt-1">{viewingSession.subject}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</label>
                <p className="text-gray-900 font-medium mt-1">{formatDateTime(viewingSession.date, viewingSession.start_time)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</label>
                <p className="text-gray-900 font-medium mt-1">{formatDuration(viewingSession.duration)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                <p className="text-gray-900 font-medium mt-1 capitalize">{viewingSession.session_type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery</label>
                <p className="text-gray-900 font-medium mt-1 capitalize">{viewingSession.delivery_mode}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    viewingSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                    viewingSession.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {viewingSession.status}
                  </span>
                </div>
              </div>
            </div>

            {viewingSession.meeting_link && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 block">Meeting Link</label>
                <a 
                  href={viewingSession.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-purple hover:text-primary-navy font-medium hover:underline break-all"
                >
                  {viewingSession.meeting_link}
                </a>
              </div>
            )}

            {viewingSession.location && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <label className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 block">Location</label>
                <p className="text-gray-900 font-medium">{viewingSession.location}</p>
              </div>
            )}

            {viewingSession.status === 'scheduled' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleMarkComplete(viewingSession.id)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaCheckCircle className="text-lg" />
                  Mark as Complete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorDashboard;

