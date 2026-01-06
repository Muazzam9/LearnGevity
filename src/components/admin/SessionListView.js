import React, { useMemo, useState } from 'react';
import { FaMapMarkerAlt, FaVideo, FaClock, FaUser, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatDateTime, formatDuration } from '../../utils/dateHelpers';

const SessionListView = ({ sessions, students, tutors, onView, onEdit, onDelete }) => {
  const [filter, setFilter] = useState('all'); // today, week, all
  const [statusFilter, setStatusFilter] = useState('all'); // all, scheduled, completed, etc.

  // Group sessions by date categories
  const groupedSessions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const groups = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
    };

    sessions
      .filter((session) => {
        if (statusFilter === 'all') return true;
        return session.status === statusFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start_time}`);
        const dateB = new Date(`${b.date}T${b.start_time}`);
        return dateA - dateB;
      })
      .forEach((session) => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);

        if (sessionDate.getTime() === today.getTime()) {
          groups.today.push(session);
        } else if (sessionDate.getTime() === tomorrow.getTime()) {
          groups.tomorrow.push(session);
        } else if (sessionDate < weekEnd) {
          groups.thisWeek.push(session);
        } else {
          groups.later.push(session);
        }
      });

    return groups;
  }, [sessions, statusFilter]);

  // Filter sessions based on selected filter
  const filteredSessions = useMemo(() => {
    let result = [];
    
    if (filter === 'today') {
      result = groupedSessions.today;
    } else if (filter === 'week') {
      result = [
        ...groupedSessions.today,
        ...groupedSessions.tomorrow,
        ...groupedSessions.thisWeek,
      ];
    } else {
      result = sessions.filter((session) => {
        if (statusFilter === 'all') return true;
        return session.status === statusFilter;
      }).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.start_time}`);
        const dateB = new Date(`${b.date}T${b.start_time}`);
        return dateA - dateB;
      });
    }

    return result;
  }, [filter, groupedSessions, sessions, statusFilter]);

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown Student';
  };

  const getTutorName = (tutorId) => {
    const tutor = tutors.find((t) => t.id === tutorId);
    return tutor ? tutor.name : 'Unknown Tutor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'cancelled':
        return 'border-red-500 bg-red-50';
      case 'postponed':
        return 'border-yellow-500 bg-yellow-50';
      case 'no-show':
        return 'border-gray-500 bg-gray-50';
      default:
        return 'border-primary-purple bg-purple-50';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const renderSessionCard = (session) => {
    const studentName = getStudentName(session.student_id);
    const tutorName = getTutorName(session.tutor_id);
    const dateTime = formatDateTime(session.date, session.start_time);
    const duration = formatDuration(session.duration);

    return (
      <div
        key={session.id}
        className={`border-l-4 ${getStatusColor(
          session.status
        )} rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all`}
      >
        {/* Header: Student & Tutor Names + Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-purple/20 flex items-center justify-center text-primary-purple font-bold text-sm">
                {studentName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 truncate">{studentName}</h3>
                <p className="text-xs text-gray-600">Student</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-10">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-orange/20 flex items-center justify-center text-primary-orange font-bold text-xs">
                {tutorName.charAt(0)}
              </div>
              <p className="text-sm text-gray-700 truncate">{tutorName}</p>
            </div>
          </div>
          <span
            className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded-full uppercase ${getStatusBadgeColor(
              session.status
            )}`}
          >
            {session.status}
          </span>
        </div>

        {/* Subject */}
        <div className="mb-2">
          <span className="text-sm font-semibold text-primary-navy">{session.subject}</span>
        </div>

        {/* Session Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <FaClock className="text-primary-orange flex-shrink-0" />
            <span className="font-medium">{dateTime}</span>
            <span className="text-gray-500">• {duration}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            {session.delivery_mode === 'online' ? (
              <>
                <FaVideo className="text-primary-purple flex-shrink-0" />
                <span>Online Session</span>
              </>
            ) : (
              <>
                <FaMapMarkerAlt className="text-primary-purple flex-shrink-0" />
                <span>In-person</span>
              </>
            )}
            <span className="text-gray-500">
              • {session.session_type === 'private' ? 'Private' : 'Group'}
            </span>
          </div>
        </div>

        {/* Optional Notes Preview */}
        {session.notes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 italic line-clamp-2">
              <span className="font-semibold">Note: </span>
              {session.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
          <button
            onClick={() => onView(session)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-purple/10 text-primary-purple rounded-lg hover:bg-primary-purple/20 transition-colors text-sm font-semibold"
          >
            <FaEye />
            <span>View</span>
          </button>
          <button
            onClick={() => onEdit(session)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-navy/10 text-primary-navy rounded-lg hover:bg-primary-navy/20 transition-colors text-sm font-semibold"
          >
            <FaEdit />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(session)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        </div>
      </div>
    );
  };

  const renderGroup = (title, sessions) => {
    if (sessions.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-primary-navy mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary-orange rounded-full"></span>
          {title}
          <span className="text-sm font-normal text-gray-500">({sessions.length})</span>
        </h2>
        {sessions.map(renderSessionCard)}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      {/* Filter Tabs */}
      <div className="mb-4 space-y-3">
        {/* Date Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === 'today'
                ? 'bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today {groupedSessions.today.length > 0 && `(${groupedSessions.today.length})`}
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === 'week'
                ? 'bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sessions
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              statusFilter === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setStatusFilter('postponed')}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              statusFilter === 'postponed'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Postponed
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="max-h-[600px] overflow-y-auto pr-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-700 font-semibold">No sessions found</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === 'today'
                ? "No sessions scheduled for today"
                : filter === 'week'
                ? "No sessions scheduled this week"
                : statusFilter !== 'all'
                ? `No ${statusFilter} sessions found`
                : "No sessions scheduled yet"}
            </p>
          </div>
        ) : filter === 'all' ? (
          <>
            {renderGroup('Today', groupedSessions.today)}
            {renderGroup('Tomorrow', groupedSessions.tomorrow)}
            {renderGroup('This Week', groupedSessions.thisWeek)}
            {renderGroup('Later', groupedSessions.later)}
          </>
        ) : (
          filteredSessions.map(renderSessionCard)
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status Legend</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Postponed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">No-Show</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionListView;

