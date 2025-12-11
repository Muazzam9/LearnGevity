import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../hooks/useAuth';
import MySchedule from '../../components/tutor/MySchedule';
import AvailabilityManager from '../../components/tutor/AvailabilityManager';
import Modal from '../../components/Modal';
import { formatDateTime, formatDuration } from '../../utils/dateHelpers';

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
          .select('id, name')
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
    return students.find(s => s.id === studentId)?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/tutor/dashboard" className="text-2xl font-bold text-primary-navy">
                LearnGevity Tutor
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm">{tutorProfile?.name || user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">
          Welcome, {tutorProfile?.name || 'Tutor'}!
        </h1>

        {/* Session Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-navy mb-4">This Week</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-purple">{stats.scheduled}</div>
              <div className="text-gray-600 text-sm">Scheduled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-orange">{stats.totalHours}</div>
              <div className="text-gray-600 text-sm">Total Hours</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowAvailability(!showAvailability)}
            className="bg-primary-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
          <h2 className="text-2xl font-bold text-primary-navy mb-4">My Schedule</h2>
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
              <p className="text-lg">No sessions scheduled yet</p>
              <p className="text-sm mt-2">Check back later for your upcoming tutoring sessions</p>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Student</label>
                <p className="text-gray-900">{getStudentName(viewingSession.student_id)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Subject</label>
                <p className="text-gray-900">{viewingSession.subject}</p>
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
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
              <div>
                <label className="text-sm font-medium text-gray-500">Meeting Link</label>
                <a 
                  href={viewingSession.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-purple hover:underline block"
                >
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

            {viewingSession.status === 'scheduled' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleMarkComplete(viewingSession.id)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                >
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

