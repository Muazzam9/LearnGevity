import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../components/admin/AdminLayout";
import SessionListView from "../../components/admin/SessionListView";
import SessionCalendarView from "../../components/admin/SessionCalendarView";
import SessionForm from "../../components/admin/SessionForm";
import Modal from "../../components/Modal";
import Alert from "../../components/Alert";
import { formatDateTime, formatDuration } from "../../utils/dateHelpers";
import {
  FaPlus,
  FaCalendarAlt,
  FaCalendarCheck,
  FaList,
  FaCalendar,
} from "react-icons/fa";

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
  const [viewMode, setViewMode] = useState("list"); // Mobile-first default
  const [filters, setFilters] = useState({
    tutor: "",
    student: "",
    subject: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [sessionsResult, tutorsResult, studentsResult] = await Promise.all([
        supabase
          .from("sessions")
          .select("*")
          .order("date", { ascending: true })
          .order("start_time"),
        supabase
          .from("tutors")
          .select("id, name, subjects")
          .eq("is_active", true)
          .order("name"),
        supabase
          .from("students")
          .select("id, first_name, last_name")
          .order("first_name"),
      ]);

      if (sessionsResult.error) throw sessionsResult.error;
      if (tutorsResult.error) throw tutorsResult.error;
      if (studentsResult.error) throw studentsResult.error;

      setSessions(sessionsResult.data || []);
      setTutors(tutorsResult.data || []);
      setStudents(studentsResult.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("error", "Failed to load data");
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
        .from("sessions")
        .delete()
        .eq("id", deleteConfirm.id);

      if (error) throw error;
      showAlert("success", "Session deleted successfully");
      fetchAllData();
      setViewingSession(null);
    } catch (error) {
      console.error("Error deleting session:", error);
      showAlert("error", "Failed to delete session");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    setSelectedSession(null);
    showAlert("success", message);
    fetchAllData();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  // Filter sessions
  const filteredSessions = sessions.filter((session) => {
    if (filters.tutor && session.tutor_id !== filters.tutor) return false;
    if (filters.student && session.student_id !== filters.student) return false;
    if (
      filters.subject &&
      !session.subject.toLowerCase().includes(filters.subject.toLowerCase())
    )
      return false;
    return true;
  });

  const getTutorName = (tutorId) => {
    return tutors.find((t) => t.id === tutorId)?.name || "Unknown";
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : "Unknown";
  };

  return (
    <AdminLayout>
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
          {/* View Toggle */}
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
            onClick={() => setFilters({ tutor: "", student: "", subject: "" })}
            className="text-sm text-primary-purple hover:text-primary-navy font-semibold"
          >
            Clear All
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            value={filters.tutor}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, tutor: e.target.value }))
            }
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
          >
            <option value="">All Tutors</option>
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.name}
              </option>
            ))}
          </select>

          <select
            value={filters.student}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, student: e.target.value }))
            }
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by subject..."
            value={filters.subject}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-purple focus:border-primary-purple transition-all"
          />
        </div>
      </div>

      {/* Calendar or List View */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sessions...</p>
        </div>
      ) : viewMode === "list" ? (
        <SessionListView
          sessions={filteredSessions}
          tutors={tutors}
          students={students}
          onView={setViewingSession}
          onEdit={handleEditSession}
          onDelete={handleDeleteSession}
        />
      ) : (
        <SessionCalendarView
          sessions={filteredSessions}
          tutors={tutors}
          students={students}
          onEventClick={setViewingSession}
        />
      )}

      {/* Add/Edit Session Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSession(null);
        }}
        title={selectedSession ? "Edit Session" : "Create New Session"}
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
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tutor
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {getTutorName(viewingSession.tutor_id)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Student
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {getStudentName(viewingSession.student_id)}
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

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                onClick={() => handleEditSession(viewingSession)}
                className="flex-1 bg-gradient-to-r from-primary-purple to-primary-navy text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                Edit Session
              </button>
              <button
                onClick={() => handleDeleteSession(viewingSession)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
              >
                Delete Session
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
        <div className="space-y-5">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              Are you sure you want to delete this session? This action cannot
              be undone.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
            >
              Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default SessionManagement;
