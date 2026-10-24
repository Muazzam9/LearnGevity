import {
  isUpcomingSession,
  formatBlockRange,
  formatSessionRange,
} from './tutorSchedule';

const base = {
  id: 'x',
  date: '2026-10-27',
  start_time: '15:00:00',
  duration: 60,
  status: 'scheduled',
};

describe('isUpcomingSession', () => {
  const sat = new Date(2026, 9, 24, 12, 0, 0);

  test('future scheduled session is upcoming', () => {
    expect(isUpcomingSession(base, sat)).toBe(true);
  });

  test('only "scheduled" counts (not completed/cancelled/postponed/no-show)', () => {
    ['completed', 'cancelled', 'postponed', 'no-show'].forEach((status) => {
      expect(isUpcomingSession({ ...base, status }, sat)).toBe(false);
    });
  });

  test('a scheduled session on a past day is not upcoming', () => {
    expect(isUpcomingSession({ ...base, date: '2026-10-23' }, sat)).toBe(false);
  });

  test('today: already finished is not upcoming, in progress / later is', () => {
    const today = { ...base, date: '2026-10-24', start_time: '09:00:00', duration: 60 }; // ends 10:00
    expect(isUpcomingSession(today, sat)).toBe(false); // now = 12:00

    const inProgress = { ...today, start_time: '11:30:00', duration: 60 }; // ends 12:30
    expect(isUpcomingSession(inProgress, sat)).toBe(true);

    const later = { ...today, start_time: '16:00:00' };
    expect(isUpcomingSession(later, sat)).toBe(true);
  });

  test('handles missing / malformed input without throwing', () => {
    expect(isUpcomingSession(null, sat)).toBe(false);
    expect(isUpcomingSession({ status: 'scheduled' }, sat)).toBe(false);
  });
});

describe('formatBlockRange', () => {
  test('same-day block shows one date with a time range', () => {
    const start = new Date(2026, 9, 27, 9, 0).toISOString();
    const end = new Date(2026, 9, 27, 12, 30).toISOString();
    expect(formatBlockRange(start, end)).toBe(
      'Tue, 27 Oct 2026 · 9:00 AM – 12:30 PM'
    );
  });

  test('multi-day block shows both dates', () => {
    const start = new Date(2026, 9, 27, 9, 0).toISOString();
    const end = new Date(2026, 9, 30, 17, 0).toISOString();
    expect(formatBlockRange(start, end)).toBe(
      'Tue, 27 Oct 2026, 9:00 AM → Fri, 30 Oct 2026, 5:00 PM'
    );
  });
});

describe('formatSessionRange', () => {
  test('formats date with start and end time', () => {
    expect(formatSessionRange(base)).toBe('Tue, 27 Oct 2026 · 3:00 PM – 4:00 PM');
  });

  test('90 minute session', () => {
    expect(formatSessionRange({ ...base, duration: 90 })).toBe(
      'Tue, 27 Oct 2026 · 3:00 PM – 4:30 PM'
    );
  });
});
