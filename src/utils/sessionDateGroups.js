import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

// Weeks run Monday (1) to Sunday.
export const WEEK_STARTS_ON = 1;

const toKey = (date) => format(date, 'yyyy-MM-dd');

// Session dates come from a Postgres `date` column ("YYYY-MM-DD").
// Compare them as plain strings so timezones can never shift a session
// onto a different day.
const dateKey = (session) => String(session.date).slice(0, 10);

const compareAsc = (a, b) =>
  `${dateKey(a)}T${a.start_time || ''}`.localeCompare(
    `${dateKey(b)}T${b.start_time || ''}`
  );

/**
 * Returns the current Monday-Sunday week as inclusive "yyyy-MM-dd" keys.
 */
export const getWeekRange = (now = new Date()) => ({
  start: toKey(startOfWeek(now, { weekStartsOn: WEEK_STARTS_ON })),
  end: toKey(endOfWeek(now, { weekStartsOn: WEEK_STARTS_ON })),
});

/**
 * True if the session's date falls inside the current Monday-Sunday week.
 */
export const isSessionInCurrentWeek = (session, now = new Date()) => {
  const { start, end } = getWeekRange(now);
  const key = dateKey(session);
  return key >= start && key <= end;
};

/**
 * Splits sessions into date buckets relative to `now`.
 *
 * Upcoming buckets (soonest first): today, tomorrow, thisWeek (the rest of the
 * Monday-Sunday week after tomorrow), later.
 * `past` holds everything before today (most recent first).
 *
 * Filter views:
 *   todayAll - sessions today
 *   weekAll  - every session in the current Monday-Sunday week (incl. earlier days)
 *   monthAll - every session in the current calendar month
 *   all      - everything, soonest first
 */
export const groupSessionsByDate = (sessions, now = new Date()) => {
  const today = toKey(now);
  const tomorrow = toKey(addDays(now, 1));
  const weekStart = toKey(startOfWeek(now, { weekStartsOn: WEEK_STARTS_ON }));
  const weekEnd = toKey(endOfWeek(now, { weekStartsOn: WEEK_STARTS_ON }));
  const monthStart = toKey(startOfMonth(now));
  const monthEnd = toKey(endOfMonth(now));

  const sorted = [...sessions].sort(compareAsc);

  const groups = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    past: [],
    todayAll: [],
    weekAll: [],
    monthAll: [],
    all: sorted,
  };

  sorted.forEach((session) => {
    const key = dateKey(session);

    if (key === today) groups.todayAll.push(session);
    if (key >= weekStart && key <= weekEnd) groups.weekAll.push(session);
    if (key >= monthStart && key <= monthEnd) groups.monthAll.push(session);

    if (key < today) {
      groups.past.push(session);
    } else if (key === today) {
      groups.today.push(session);
    } else if (key === tomorrow) {
      groups.tomorrow.push(session);
    } else if (key <= weekEnd) {
      groups.thisWeek.push(session);
    } else {
      groups.later.push(session);
    }
  });

  groups.past.reverse(); // most recent past session first

  return groups;
};
