import { supabase } from '../lib/supabaseClient';
import { combineDateAndTime, doTimeRangesOverlap, calculateEndTime } from './dateHelpers';

/**
 * Check for scheduling conflicts
 * Returns an object with hasConflict boolean and conflicts array
 */
export const checkForConflicts = async (sessionData, excludeSessionId = null) => {
  const { tutor_id, date, start_time, duration } = sessionData;
  
  if (!tutor_id || !date || !start_time || !duration) {
    return { hasConflict: false, conflicts: [] };
  }

  const conflicts = [];
  const end_time = calculateEndTime(start_time, duration);

  // 1. Check for overlapping sessions with the same tutor
  const sessionConflicts = await checkSessionConflicts(
    tutor_id,
    date,
    start_time,
    end_time,
    excludeSessionId
  );
  
  if (sessionConflicts.length > 0) {
    conflicts.push({
      type: 'session',
      message: `Tutor has ${sessionConflicts.length} conflicting session(s) at this time`,
      details: sessionConflicts,
    });
  }

  // 2. Check for tutor availability blocks
  const availabilityConflicts = await checkAvailabilityConflicts(
    tutor_id,
    date,
    start_time,
    end_time
  );
  
  if (availabilityConflicts.length > 0) {
    conflicts.push({
      type: 'availability',
      message: `Tutor is unavailable during this time`,
      details: availabilityConflicts,
    });
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};

/**
 * Check for overlapping sessions
 */
const checkSessionConflicts = async (tutorId, date, startTime, endTime, excludeSessionId) => {
  try {
    let query = supabase
      .from('sessions')
      .select('id, subject, start_time, duration, student:students(name)')
      .eq('tutor_id', tutorId)
      .eq('date', date)
      .neq('status', 'cancelled');

    // Exclude current session if editing
    if (excludeSessionId) {
      query = query.neq('id', excludeSessionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error checking session conflicts:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Filter sessions that overlap with the requested time
    const conflicts = data.filter(session => {
      const sessionEndTime = calculateEndTime(session.start_time, session.duration);
      return doTimeRangesOverlap(
        startTime,
        endTime,
        session.start_time,
        sessionEndTime
      );
    });

    return conflicts.map(session => ({
      id: session.id,
      subject: session.subject,
      student: session.student?.name || 'Unknown',
      start_time: session.start_time,
      duration: session.duration,
    }));
  } catch (error) {
    console.error('Error in checkSessionConflicts:', error);
    return [];
  }
};

/**
 * Check for tutor availability blocks
 */
const checkAvailabilityConflicts = async (tutorId, date, startTime, endTime) => {
  try {
    // Combine date and times to create full datetime objects
    const requestStart = combineDateAndTime(date, startTime);
    const requestEnd = combineDateAndTime(date, endTime);

    if (!requestStart || !requestEnd) {
      return [];
    }

    // Get availability blocks that might overlap
    const { data, error } = await supabase
      .from('tutor_availability_blocks')
      .select('id, start_datetime, end_datetime, reason')
      .eq('tutor_id', tutorId)
      .lte('start_datetime', requestEnd.toISOString())
      .gte('end_datetime', requestStart.toISOString());

    if (error) {
      console.error('Error checking availability conflicts:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Filter blocks that actually overlap (database query is approximate)
    const conflicts = data.filter(block => {
      const blockStart = new Date(block.start_datetime);
      const blockEnd = new Date(block.end_datetime);
      
      // Check if there's actual overlap
      return requestStart < blockEnd && requestEnd > blockStart;
    });

    return conflicts.map(block => ({
      id: block.id,
      start: new Date(block.start_datetime),
      end: new Date(block.end_datetime),
      reason: block.reason || 'Unavailable',
    }));
  } catch (error) {
    console.error('Error in checkAvailabilityConflicts:', error);
    return [];
  }
};

/**
 * Format conflict details for display
 */
export const formatConflictMessage = (conflicts) => {
  if (!conflicts || conflicts.length === 0) {
    return '';
  }

  const messages = conflicts.map(conflict => {
    if (conflict.type === 'session') {
      const details = conflict.details.map(session => 
        `• ${session.subject} with ${session.student} at ${session.start_time}`
      ).join('\n');
      return `${conflict.message}:\n${details}`;
    } else if (conflict.type === 'availability') {
      const details = conflict.details.map(block => 
        `• ${block.reason}`
      ).join('\n');
      return `${conflict.message}:\n${details}`;
    }
    return conflict.message;
  });

  return messages.join('\n\n');
};

/**
 * Quick check if a tutor is available (returns boolean only)
 */
export const isTutorAvailable = async (tutorId, date, startTime, duration) => {
  const result = await checkForConflicts({
    tutor_id: tutorId,
    date,
    start_time: startTime,
    duration,
  });
  
  return !result.hasConflict;
};

