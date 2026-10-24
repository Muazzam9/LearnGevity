import { format, isSameDay } from 'date-fns';
import { combineDateAndTime, calculateEndTime } from './dateHelpers';

/**
 * A session is "upcoming" if it is still scheduled and has not finished yet.
 * (A session earlier today that is already over is not upcoming.)
 */
export const isUpcomingSession = (session, now = new Date()) => {
  if (!session || session.status !== 'scheduled') return false;

  const start = combineDateAndTime(String(session.date).slice(0, 10), String(session.start_time).slice(0, 5));
  if (!start) return false;

  const end = new Date(start.getTime() + (Number(session.duration) || 0) * 60000);
  return end >= now;
};

/**
 * "Mon, 27 Oct 2026 · 9:00 AM – 12:00 PM"  (same day)
 * "Mon, 27 Oct 2026, 9:00 AM → Fri, 31 Oct 2026, 5:00 PM"  (multi-day)
 */
export const formatBlockRange = (startISO, endISO) => {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const dayFmt = 'EEE, d MMM yyyy';
  const timeFmt = 'h:mm a';

  if (isSameDay(start, end)) {
    return `${format(start, dayFmt)} · ${format(start, timeFmt)} – ${format(end, timeFmt)}`;
  }
  return `${format(start, dayFmt)}, ${format(start, timeFmt)} → ${format(end, dayFmt)}, ${format(end, timeFmt)}`;
};

/**
 * "Tue, 27 Oct 2026 · 3:00 PM – 4:00 PM"
 */
export const formatSessionRange = (session) => {
  const start = combineDateAndTime(String(session.date).slice(0, 10), String(session.start_time).slice(0, 5));
  if (!start) return '';
  const endTime = calculateEndTime(String(session.start_time).slice(0, 5), Number(session.duration));
  const endLabel = endTime
    ? format(combineDateAndTime(String(session.date).slice(0, 10), endTime), 'h:mm a')
    : '';
  return `${format(start, 'EEE, d MMM yyyy')} · ${format(start, 'h:mm a')}${endLabel ? ` – ${endLabel}` : ''}`;
};
