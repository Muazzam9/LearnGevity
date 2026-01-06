import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import TutorLayout from "../../components/tutor/TutorLayout";
import SessionList from "../../components/tutor/SessionList";
import SessionCalendarView from "../../components/tutor/SessionCalendarView";
import AvailabilityManager from "../../components/tutor/AvailabilityManager";
import Modal from "../../components/Modal";
import { formatDateTime, formatDuration } from "../../utils/dateHelpers";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaList,
  FaCalendar,
} from "react-icons/fa";

const TutorDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingSession, setViewingSession] = useState(null);
  const [showAvailability, setShowAvailability] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
  const [stats, setStats] = useState({
    scheduled: 0,
    completed: 0,
    totalHours: 0,
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: "completed",
    notes: "",
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTutorData();
    }
  }, [user]);

  const fetchTutorData = async () => {
    try {
      setLoading(true);

      const { data: tutorData, error: tutorError } = await supabase
        .from("tutors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (tutorError) throw tutorError;
      setTutorProfile(tutorData);

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .eq("tutor_id", tutorData.id)
        .order("date")
        .order("start_time");

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      const studentIds = [...new Set(sessionsData.map((s) => s.student_id))];

      if (studentIds.length > 0) {
        const { data: studentsData, error: studentsError } = await supabase
          .from("students")
          .select("id, first_name, last_name")
          .in("id", studentIds);

        if (studentsError) throw studentsError;
        setStudents(studentsData || []);
      }

      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const thisWeekSessions = sessionsData.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      const scheduled = thisWeekSessions.filter(
        (s) => s.status === "scheduled"
      ).length;
      const completed = thisWeekSessions.filter(
        (s) => s.status === "completed"
      ).length;
      const totalMinutes = thisWeekSessions
        .filter((s) => s.status !== "cancelled")
        .reduce((sum, s) => sum + s.duration, 0);

      setStats({
        scheduled,
        completed,
        totalHours: (totalMinutes / 60).toFixed(1),
      });
    } catch (error) {
      console.error("Error fetching tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSession = (event) => {
    const session = event.resource;
    setViewingSession(session);
    // Reset status update form
    setStatusUpdate({
      status: "completed",
      notes: "",
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);

    try {
      const updateData = {
        status: statusUpdate.status,
        updated_at: new Date().toISOString(),
      };

      if (statusUpdate.notes.trim()) {
        updateData.notes = statusUpdate.notes.trim();
      }

      const { error } = await supabase
        .from("sessions")
        .update(updateData)
        .eq("id", viewingSession.id);

      if (error) throw error;

      setViewingSession(null);
      setStatusUpdate({ status: "completed", notes: "" });
      fetchTutorData(); // Refresh data
    } catch (error) {
      console.error("Error updating session status:", error);
      alert(`Failed to update session status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : "Unknown";
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
    <TutorLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-2">
          Welcome, {tutorProfile?.name || "Tutor"}!
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
          <div className="text-3xl sm:text-4xl font-bold mb-1">
            {stats.scheduled}
          </div>
          <div className="text-sm opacity-90">Scheduled This Week</div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <FaCheckCircle className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold mb-1">
            {stats.completed}
          </div>
          <div className="text-sm opacity-90">Completed This Week</div>
        </div>

        {/* Total Hours */}
        <div className="bg-gradient-to-br from-primary-orange to-primary-orange/80 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <FaClock className="text-3xl opacity-80" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold mb-1">
            {stats.totalHours}h
          </div>
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
          {showAvailability ? "Hide" : "Manage"} Availability
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-navy">
            My Schedule
          </h2>

          {/* View Toggle */}
          {sessions.length > 0 && (
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaList />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === "calendar"
                    ? "bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaCalendar />
                <span className="hidden sm:inline">Calendar</span>
              </button>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-700 font-semibold">
              No sessions scheduled yet
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for your upcoming tutoring sessions
            </p>
          </div>
        ) : viewMode === "list" ? (
          <SessionList
            sessions={sessions}
            students={students}
            onSelectEvent={handleViewSession}
          />
        ) : (
          <SessionCalendarView
            sessions={sessions}
            students={students}
            onSelectEvent={handleViewSession}
          />
        )}
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
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Student
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {viewingSession.studentName ||
                    getStudentName(viewingSession.student_id)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Subject
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {viewingSession.subject}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Date & Time
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {formatDateTime(
                    viewingSession.date,
                    viewingSession.start_time
                  )}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Duration
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {formatDuration(viewingSession.duration)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Type
                </label>
                <p className="text-gray-900 font-medium mt-1 capitalize">
                  {viewingSession.session_type}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Delivery
                </label>
                <p className="text-gray-900 font-medium mt-1 capitalize">
                  {viewingSession.delivery_mode}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </label>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      viewingSession.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : viewingSession.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : viewingSession.status === "postponed"
                        ? "bg-yellow-100 text-yellow-800"
                        : viewingSession.status === "no-show"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {viewingSession.status}
                  </span>
                </div>
              </div>
            </div>

            {viewingSession.meeting_link && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2 block">
                  Meeting Link
                </label>
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
                <label className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2 block">
                  Location
                </label>
                <p className="text-gray-900 font-medium">
                  {viewingSession.location}
                </p>
              </div>
            )}

            {viewingSession.notes && (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                  Notes
                </label>
                <p className="text-gray-900">{viewingSession.notes}</p>
              </div>
            )}

            {viewingSession.status === "scheduled" && (
              <form
                onSubmit={handleUpdateStatus}
                className="pt-4 border-t space-y-4"
              >
                <div className="bg-primary-purple/5 border border-primary-purple/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-primary-navy mb-3 uppercase tracking-wide">
                    Update Session Status
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        New Status *
                      </label>
                      <select
                        id="status"
                        value={statusUpdate.status}
                        onChange={(e) =>
                          setStatusUpdate({
                            ...statusUpdate,
                            status: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-base text-gray-900 focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-shadow"
                      >
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="postponed">Postponed/Rescheduled</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Reason / Comment (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={statusUpdate.notes}
                        onChange={(e) =>
                          setStatusUpdate({
                            ...statusUpdate,
                            notes: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none text-base text-gray-900 focus:ring-2 focus:ring-primary-purple focus:border-transparent transition-shadow resize-none"
                        placeholder="Add any notes or reason for this status update..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="w-full bg-gradient-to-r from-primary-purple to-primary-navy text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-lg" />
                      Update Session Status
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </Modal>
    </TutorLayout>
  );
};

export default TutorDashboard;
