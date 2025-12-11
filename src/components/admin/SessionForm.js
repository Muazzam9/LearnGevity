import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { checkForConflicts, formatConflictMessage } from '../../utils/conflictDetection';
import { formatDate, formatTime, getTodayDate, calculateEndTime } from '../../utils/dateHelpers';

const SessionForm = ({ session, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    tutor_id: '',
    student_id: '',
    subject: '',
    date: getTodayDate(),
    start_time: '',
    duration: 60,
    session_type: 'private',
    delivery_mode: 'online',
    location: '',
    meeting_link: '',
  });

  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState('');
  const [conflictWarning, setConflictWarning] = useState(null);
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  useEffect(() => {
    fetchTutorsAndStudents();
  }, []);

  useEffect(() => {
    if (session) {
      setFormData({
        tutor_id: session.tutor_id || '',
        student_id: session.student_id || '',
        subject: session.subject || '',
        date: formatDate(session.date) || getTodayDate(),
        start_time: formatTime(session.start_time) || '',
        duration: session.duration || 60,
        session_type: session.session_type || 'private',
        delivery_mode: session.delivery_mode || 'online',
        location: session.location || '',
        meeting_link: session.meeting_link || '',
      });
    }
  }, [session]);

  // Check for conflicts when relevant fields change
  useEffect(() => {
    const checkConflicts = async () => {
      if (formData.tutor_id && formData.date && formData.start_time && formData.duration) {
        setCheckingConflicts(true);
        const result = await checkForConflicts(formData, session?.id);
        
        if (result.hasConflict) {
          setConflictWarning({
            message: formatConflictMessage(result.conflicts),
            conflicts: result.conflicts,
          });
        } else {
          setConflictWarning(null);
        }
        setCheckingConflicts(false);
      }
    };

    // Debounce conflict check
    const timer = setTimeout(checkConflicts, 500);
    return () => clearTimeout(timer);
  }, [formData.tutor_id, formData.date, formData.start_time, formData.duration, session?.id]);

  const fetchTutorsAndStudents = async () => {
    try {
      setFetchingData(true);

      const [tutorsResult, studentsResult] = await Promise.all([
        supabase.from('tutors').select('id, name, subjects').eq('is_active', true).order('name'),
        supabase.from('students').select('id, name, subjects_needed').order('name'),
      ]);

      if (tutorsResult.error) throw tutorsResult.error;
      if (studentsResult.error) throw studentsResult.error;

      setTutors(tutorsResult.data || []);
      setStudents(studentsResult.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load tutors and students');
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Warn if there are conflicts
    if (conflictWarning) {
      const proceed = window.confirm(
        'There are scheduling conflicts:\n\n' +
        conflictWarning.message +
        '\n\nDo you want to proceed anyway?'
      );
      if (!proceed) return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionData = {
        tutor_id: formData.tutor_id,
        student_id: formData.student_id,
        subject: formData.subject,
        date: formData.date,
        start_time: formData.start_time,
        duration: parseInt(formData.duration),
        session_type: formData.session_type,
        delivery_mode: formData.delivery_mode,
        location: formData.delivery_mode === 'in-person' ? formData.location : null,
        meeting_link: formData.delivery_mode === 'online' ? formData.meeting_link : null,
        status: 'scheduled',
      };

      if (session) {
        // Update existing session
        const { error: updateError } = await supabase
          .from('sessions')
          .update({ ...sessionData, updated_at: new Date().toISOString() })
          .eq('id', session.id);

        if (updateError) throw updateError;
        onSuccess('Session updated successfully!');
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from('sessions')
          .insert([sessionData]);

        if (insertError) throw insertError;
        onSuccess('Session created successfully!');
      }
    } catch (err) {
      console.error('Error saving session:', err);
      setError(err.message || 'Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  const endTime = formData.start_time && formData.duration 
    ? calculateEndTime(formData.start_time, formData.duration)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {conflictWarning && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Scheduling Conflict Detected!</strong>
              <pre className="mt-2 text-sm whitespace-pre-wrap">{conflictWarning.message}</pre>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="tutor_id" className="block text-sm font-medium text-gray-700 mb-2">
            Tutor *
          </label>
          <select
            id="tutor_id"
            name="tutor_id"
            required
            value={formData.tutor_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="">Select tutor...</option>
            {tutors.map(tutor => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.name} ({tutor.subjects?.join(', ')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 mb-2">
            Student *
          </label>
          <select
            id="student_id"
            name="student_id"
            required
            value={formData.student_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="">Select student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} (needs: {student.subjects_needed?.join(', ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          placeholder="e.g., Algebra, English Literature"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            min={getTodayDate()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            id="start_time"
            name="start_time"
            required
            value={formData.start_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          />
          {checkingConflicts && <p className="text-xs text-gray-500 mt-1">Checking availability...</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes) *
          </label>
          <select
            id="duration"
            name="duration"
            required
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>

      {endTime && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          Session will end at <strong>{endTime}</strong>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="session_type" className="block text-sm font-medium text-gray-700 mb-2">
            Session Type *
          </label>
          <select
            id="session_type"
            name="session_type"
            required
            value={formData.session_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="private">Private (1-on-1)</option>
            <option value="group">Group</option>
          </select>
        </div>

        <div>
          <label htmlFor="delivery_mode" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Mode *
          </label>
          <select
            id="delivery_mode"
            name="delivery_mode"
            required
            value={formData.delivery_mode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
          >
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>
      </div>

      {formData.delivery_mode === 'online' && (
        <div>
          <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Link
          </label>
          <input
            type="url"
            id="meeting_link"
            name="meeting_link"
            value={formData.meeting_link}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="https://zoom.us/j/..."
          />
        </div>
      )}

      {formData.delivery_mode === 'in-person' && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            placeholder="123 Main St, City, State"
          />
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading || checkingConflicts}
          className="flex-1 bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : session ? 'Update Session' : 'Create Session'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SessionForm;

