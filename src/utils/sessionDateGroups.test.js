import {
  groupSessionsByDate,
  getWeekRange,
  isSessionInCurrentWeek,
} from './sessionDateGroups';

const s = (id, date, start_time = '10:00:00') => ({ id, date, start_time });
const ids = (list) => list.map((x) => x.id);

// Saturday 24 Oct 2026. Week is Mon 19 Oct - Sun 25 Oct. Month is October.
const SAT = new Date(2026, 9, 24, 12, 0, 0);

const sessions = [
  s('jan', '2026-01-15'), // months ago - the original bug
  s('sep30', '2026-09-30'),
  s('oct05', '2026-10-05'), // earlier this month, not this week
  s('sun18', '2026-10-18'), // Sunday of LAST week
  s('mon19', '2026-10-19'), // Monday of this week
  s('fri23', '2026-10-23'), // yesterday
  s('sat24-am', '2026-10-24', '09:00:00'), // today
  s('sat24-pm', '2026-10-24', '15:00:00'),
  s('sun25', '2026-10-25'), // tomorrow, last day of the week
  s('mon26', '2026-10-26'), // next week
  s('oct31', '2026-10-31'),
  s('nov01', '2026-11-01'),
];

describe('groupSessionsByDate', () => {
  test('"This Week" is Monday-Sunday and never includes sessions from before the week (regression)', () => {
    const { weekAll } = groupSessionsByDate(sessions, SAT);
    expect(ids(weekAll)).toEqual([
      'mon19',
      'fri23',
      'sat24-am',
      'sat24-pm',
      'sun25',
    ]);
    expect(ids(weekAll)).not.toContain('jan');
    expect(ids(weekAll)).not.toContain('sun18');
    expect(ids(weekAll)).not.toContain('mon26');
  });

  test('"This Month" is the current calendar month only', () => {
    const { monthAll } = groupSessionsByDate(sessions, SAT);
    expect(ids(monthAll)).toEqual([
      'oct05',
      'sun18',
      'mon19',
      'fri23',
      'sat24-am',
      'sat24-pm',
      'sun25',
      'mon26',
      'oct31',
    ]);
  });

  test('month boundaries: first and last day included, neighbours excluded', () => {
    const edge = [
      s('sep30', '2026-09-30'),
      s('oct01', '2026-10-01'),
      s('oct31', '2026-10-31'),
      s('nov01', '2026-11-01'),
    ];
    expect(ids(groupSessionsByDate(edge, SAT).monthAll)).toEqual([
      'oct01',
      'oct31',
    ]);
  });

  test('"Today" only has today, ordered by start time', () => {
    const { todayAll } = groupSessionsByDate(sessions, SAT);
    expect(ids(todayAll)).toEqual(['sat24-am', 'sat24-pm']);
  });

  test('All Sessions groups: past sessions are not labelled as this week', () => {
    const g = groupSessionsByDate(sessions, SAT);
    expect(ids(g.today)).toEqual(['sat24-am', 'sat24-pm']);
    expect(ids(g.tomorrow)).toEqual(['sun25']);
    expect(ids(g.thisWeek)).toEqual([]); // nothing left between tomorrow and Sunday
    expect(ids(g.later)).toEqual(['mon26', 'oct31', 'nov01']);
    // most recent past session first
    expect(ids(g.past)).toEqual(['fri23', 'mon19', 'sun18', 'oct05', 'sep30', 'jan']);
  });

  test('every session lands in exactly one All-Sessions group', () => {
    const g = groupSessionsByDate(sessions, SAT);
    const total =
      g.today.length +
      g.tomorrow.length +
      g.thisWeek.length +
      g.later.length +
      g.past.length;
    expect(total).toBe(sessions.length);
  });

  test('on a Sunday the week still ends today, and Monday is "tomorrow" but not in this week', () => {
    const sunday = new Date(2026, 9, 25, 9, 0, 0);
    const g = groupSessionsByDate(sessions, sunday);
    expect(ids(g.weekAll)).toEqual([
      'mon19',
      'fri23',
      'sat24-am',
      'sat24-pm',
      'sun25',
    ]);
    expect(ids(g.tomorrow)).toEqual(['mon26']);
  });

  test('on a Monday the new week starts, so yesterday (Sunday) is excluded', () => {
    const monday = new Date(2026, 9, 26, 9, 0, 0);
    const g = groupSessionsByDate(sessions, monday);
    expect(ids(g.weekAll)).toEqual(['mon26', 'oct31', 'nov01']);
    expect(ids(g.weekAll)).not.toContain('sun25');
  });

  test('mid-week: thisWeek holds days after tomorrow up to Sunday', () => {
    const tuesday = new Date(2026, 9, 20, 9, 0, 0);
    const g = groupSessionsByDate(sessions, tuesday);
    expect(ids(g.thisWeek)).toEqual(['fri23', 'sat24-am', 'sat24-pm', 'sun25']);
    expect(ids(g.later)).toEqual(['mon26', 'oct31', 'nov01']);
  });

  test('does not mutate the input array', () => {
    const input = [s('b', '2026-10-25'), s('a', '2026-10-19')];
    const copy = [...input];
    groupSessionsByDate(input, SAT);
    expect(input).toEqual(copy);
  });

  test('reported case: Tue 27 Oct 3pm viewed on Sat 24 Oct is next week - not "This Week", but in "This Month" and "Later"', () => {
    const reported = [s('oct27', '2026-10-27', '15:00:00')];
    const g = groupSessionsByDate(reported, SAT);
    expect(ids(g.weekAll)).toEqual([]);
    expect(ids(g.monthAll)).toEqual(['oct27']);
    expect(ids(g.later)).toEqual(['oct27']);
  });

  test('empty input', () => {
    const g = groupSessionsByDate([], SAT);
    expect(g.weekAll).toEqual([]);
    expect(g.monthAll).toEqual([]);
    expect(g.past).toEqual([]);
  });
});

describe('getWeekRange / isSessionInCurrentWeek (dashboard stats)', () => {
  test('week is Monday to Sunday for every day of the week', () => {
    // 19 Oct 2026 is a Monday ... 25 Oct is a Sunday
    for (let day = 19; day <= 25; day++) {
      expect(getWeekRange(new Date(2026, 9, day, 12))).toEqual({
        start: '2026-10-19',
        end: '2026-10-25',
      });
    }
    // The next Monday starts a new week
    expect(getWeekRange(new Date(2026, 9, 26, 12))).toEqual({
      start: '2026-10-26',
      end: '2026-11-01',
    });
  });

  test('week range crosses month and year boundaries correctly', () => {
    // Wed 30 Dec 2026 -> Mon 28 Dec 2026 - Sun 3 Jan 2027
    expect(getWeekRange(new Date(2026, 11, 30, 12))).toEqual({
      start: '2026-12-28',
      end: '2027-01-03',
    });
  });

  test('Sunday sessions belong to the week that ENDS on that Sunday (not the next one)', () => {
    const sat = new Date(2026, 9, 24, 12);
    expect(isSessionInCurrentWeek(s('a', '2026-10-25'), sat)).toBe(true);
    expect(isSessionInCurrentWeek(s('b', '2026-10-18'), sat)).toBe(false);
    expect(isSessionInCurrentWeek(s('c', '2026-10-26'), sat)).toBe(false);
    expect(isSessionInCurrentWeek(s('d', '2026-10-19'), sat)).toBe(true);
  });
});
