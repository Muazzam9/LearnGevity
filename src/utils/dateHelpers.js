import { format, parse, addMinutes, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Formats a date to YYYY-MM-DD
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

/**
 * Formats a time to HH:mm
 */
export const formatTime = (time) => {
  if (!time) return '';
  // If time is already in HH:mm format, return it
  if (typeof time === 'string' && time.match(/^\d{2}:\d{2}/)) {
    return time.substring(0, 5);
  }
  return format(new Date(time), 'HH:mm');
};

/**
 * Formats a date and time for display
 */
export const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  const dateTime = combineDateAndTime(date, time);
  return format(dateTime, 'MMM d, yyyy h:mm a');
};

/**
 * Combines a date and time string into a Date object
 */
export const combineDateAndTime = (date, time) => {
  if (!date || !time) return null;
  
  // Parse date
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  
  // Parse time (HH:mm format)
  const [hours, minutes] = time.split(':').map(Number);
  
  // Combine
  const combined = new Date(dateObj);
  combined.setHours(hours, minutes, 0, 0);
  
  return combined;
};

/**
 * Calculates end time based on start time and duration in minutes
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return null;
  
  // Parse start time (HH:mm format)
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  // Add duration
  const endDate = addMinutes(startDate, durationMinutes);
  
  return formatTime(endDate);
};

/**
 * Check if two time ranges overlap
 * Times should be in HH:mm format
 */
export const doTimeRangesOverlap = (start1, end1, start2, end2) => {
  if (!start1 || !end1 || !start2 || !end2) return false;
  
  // Convert to comparable format (minutes since midnight)
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const start1Minutes = toMinutes(start1);
  const end1Minutes = toMinutes(end1);
  const start2Minutes = toMinutes(start2);
  const end2Minutes = toMinutes(end2);
  
  // Check for overlap
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Get current time in HH:mm format
 */
export const getCurrentTime = () => {
  return format(new Date(), 'HH:mm');
};

/**
 * Check if a datetime is in the past
 */
export const isInPast = (date, time) => {
  if (!date || !time) return false;
  const dateTime = combineDateAndTime(date, time);
  return isBefore(dateTime, new Date());
};

/**
 * Check if a datetime is in the future
 */
export const isInFuture = (date, time) => {
  if (!date || !time) return false;
  const dateTime = combineDateAndTime(date, time);
  return isAfter(dateTime, new Date());
};

/**
 * Parse time string to 24-hour format
 */
export const parseTo24Hour = (timeString) => {
  if (!timeString) return '';
  
  // If already in HH:mm format, return it
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    return timeString;
  }
  
  // Try to parse other formats
  try {
    const parsed = parse(timeString, 'h:mm a', new Date());
    return format(parsed, 'HH:mm');
  } catch {
    return timeString;
  }
};

