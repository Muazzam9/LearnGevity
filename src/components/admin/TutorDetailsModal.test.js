import React from 'react';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { format, addDays, subDays } from 'date-fns';
import TutorDetailsModal from './TutorDetailsModal';
import TutorTable from './TutorTable';

// --- Supabase mock: thenable query builder that records every call -----------
const mockResults = {};
const mockCalls = [];

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: (table) => {
      const q = {
        select: (...a) => (mockCalls.push({ table, op: 'select', a }), q),
        eq: (...a) => (mockCalls.push({ table, op: 'eq', a }), q),
        gte: (...a) => (mockCalls.push({ table, op: 'gte', a }), q),
        order: (...a) => (mockCalls.push({ table, op: 'order', a }), q),
        then: (res, rej) => Promise.resolve(mockResults[table]).then(res, rej),
      };
      return q;
    },
  },
}));

const BLOCKS = 'tutor_availability_blocks';
const SESSIONS = 'sessions';
const callsFor = (table, op) =>
  mockCalls.filter((c) => c.table === table && c.op === op).map((c) => c.a);

const tutor = {
  id: 't1',
  name: 'Sahana Sivaramakrishnan',
  email: 'sahana@example.com',
  phone: '0831234567',
  hourly_rate: 180,
  is_active: true,
  subjects: ['Mathematics', 'Physics'],
  areas: ['Cape Town', 'Stellenbosch'],
  bio: 'Loves maths.',
  photo_url: '',
};

const ymd = (d) => format(d, 'yyyy-MM-dd');
const future = ymd(addDays(new Date(), 3));
const yesterday = ymd(subDays(new Date(), 1));

const renderModal = (props = {}) =>
  render(
    <TutorDetailsModal
      tutor={tutor}
      isOpen={true}
      onClose={jest.fn()}
      onEdit={jest.fn()}
      {...props}
    />
  );

beforeEach(() => {
  mockCalls.length = 0;
  mockResults[BLOCKS] = { data: [], error: null };
  mockResults[SESSIONS] = { data: [], error: null };
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

describe('TutorDetailsModal', () => {
  test('shows the tutor profile', async () => {
    renderModal();
    expect(screen.getByText('Sahana Sivaramakrishnan')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('sahana@example.com')).toBeInTheDocument();
    expect(screen.getByText('0831234567')).toBeInTheDocument();
    expect(screen.getByText('R180/hr')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText(/Cape Town, Stellenbosch/)).toBeInTheDocument();
    expect(screen.getByText('Loves maths.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());
  });

  test('lists upcoming blocked-out times with reasons, same-day and multi-day', async () => {
    mockResults[BLOCKS] = {
      data: [
        {
          id: 'b1',
          start_datetime: new Date(2026, 9, 27, 9, 0).toISOString(),
          end_datetime: new Date(2026, 9, 27, 12, 0).toISOString(),
          reason: 'Doctor appointment',
        },
        {
          id: 'b2',
          start_datetime: new Date(2026, 10, 2, 8, 0).toISOString(),
          end_datetime: new Date(2026, 10, 6, 17, 0).toISOString(),
          reason: 'Exams',
        },
      ],
      error: null,
    };
    renderModal();

    const section = screen.getByRole('region', { name: 'Blocked times' });
    await within(section).findByText('Tue, 27 Oct 2026 · 9:00 AM – 12:00 PM');
    expect(within(section).getByText('Doctor appointment')).toBeInTheDocument();
    expect(
      within(section).getByText('Mon, 2 Nov 2026, 8:00 AM → Fri, 6 Nov 2026, 5:00 PM')
    ).toBeInTheDocument();
    expect(within(section).getByText('Exams')).toBeInTheDocument();
    expect(within(section).getByText('(2)')).toBeInTheDocument();
  });

  test('queries only THIS tutor, only future blocks, only scheduled sessions from today on', async () => {
    renderModal();
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());

    expect(callsFor(BLOCKS, 'eq')).toEqual([['tutor_id', 't1']]);
    const [[col, iso]] = callsFor(BLOCKS, 'gte');
    expect(col).toBe('end_datetime');
    expect(Math.abs(new Date(iso).getTime() - Date.now())).toBeLessThan(5000);

    expect(callsFor(SESSIONS, 'eq')).toEqual([
      ['tutor_id', 't1'],
      ['status', 'scheduled'],
    ]);
    expect(callsFor(SESSIONS, 'gte')).toEqual([['date', ymd(new Date())]]);
  });

  test('lists upcoming sessions with student, subject and time; drops finished / non-scheduled rows', async () => {
    mockResults[SESSIONS] = {
      data: [
        {
          id: 's1',
          subject: 'Calculus',
          date: future,
          start_time: '15:00:00',
          duration: 90,
          status: 'scheduled',
          session_type: 'private',
          delivery_mode: 'online',
          student: { first_name: 'Thabo', last_name: 'Nkosi' },
        },
        {
          id: 's2',
          subject: 'Old one',
          date: yesterday,
          start_time: '10:00:00',
          duration: 60,
          status: 'scheduled',
          session_type: 'private',
          delivery_mode: 'online',
          student: { first_name: 'Past', last_name: 'Student' },
        },
        {
          id: 's3',
          subject: 'Completed one',
          date: future,
          start_time: '09:00:00',
          duration: 60,
          status: 'completed',
          session_type: 'private',
          delivery_mode: 'online',
          student: { first_name: 'Done', last_name: 'Student' },
        },
      ],
      error: null,
    };
    renderModal();

    const section = screen.getByRole('region', { name: 'Upcoming sessions' });
    await within(section).findByText(/Calculus · Thabo Nkosi/);
    expect(within(section).getByText(/3:00 PM – 4:30 PM/)).toBeInTheDocument();
    expect(within(section).getByText(/1 hr 30 min/)).toBeInTheDocument();
    expect(within(section).queryByText(/Old one/)).not.toBeInTheDocument();
    expect(within(section).queryByText(/Completed one/)).not.toBeInTheDocument();
    expect(within(section).getByText('(1)')).toBeInTheDocument();
  });

  test('empty states', async () => {
    renderModal();
    await screen.findByText(/No upcoming blocked times/);
    expect(screen.getByText(/No upcoming scheduled sessions/)).toBeInTheDocument();
  });

  test('a failed blocked-times query shows an ERROR, never a misleading "no blocked times"; sessions still load', async () => {
    mockResults[BLOCKS] = { data: null, error: { message: 'permission denied for table' } };
    mockResults[SESSIONS] = {
      data: [
        {
          id: 's1',
          subject: 'Maths',
          date: future,
          start_time: '10:00:00',
          duration: 60,
          status: 'scheduled',
          session_type: 'private',
          delivery_mode: 'online',
          student: { first_name: 'A', last_name: 'B' },
        },
      ],
      error: null,
    };
    renderModal();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Could not load blocked times: permission denied for table');
    expect(screen.queryByText(/No upcoming blocked times/)).not.toBeInTheDocument();
    expect(await screen.findByText(/Maths · A B/)).toBeInTheDocument();
  });

  test('a failed sessions query shows an error and blocks still load', async () => {
    mockResults[SESSIONS] = { data: null, error: { message: 'boom' } };
    renderModal();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Could not load upcoming sessions: boom');
    expect(screen.queryByText(/No upcoming scheduled sessions/)).not.toBeInTheDocument();
    expect(await screen.findByText(/No upcoming blocked times/)).toBeInTheDocument();
  });

  test('does not query anything while closed', () => {
    renderModal({ isOpen: false });
    expect(mockCalls).toHaveLength(0);
  });

  test('Edit Tutor calls onEdit with the tutor; Close calls onClose', async () => {
    const onEdit = jest.fn();
    const onClose = jest.fn();
    renderModal({ onEdit, onClose });
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Edit Tutor' }));
    expect(onEdit).toHaveBeenCalledWith(tutor);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('opening a different tutor reloads that tutor\'s data', async () => {
    const { rerender } = renderModal();
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());

    mockCalls.length = 0;
    rerender(
      <TutorDetailsModal
        tutor={{ ...tutor, id: 't2', name: 'Other Tutor' }}
        isOpen={true}
        onClose={jest.fn()}
        onEdit={jest.fn()}
      />
    );
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());
    expect(callsFor(BLOCKS, 'eq')).toEqual([['tutor_id', 't2']]);
    expect(screen.getByText('Other Tutor')).toBeInTheDocument();
  });
});

describe('TutorTable - tapping a tutor', () => {
  const tutors = [tutor];

  test('clicking a tutor row calls onView', () => {
    const onView = jest.fn();
    render(<TutorTable tutors={tutors} onEdit={jest.fn()} onDelete={jest.fn()} onView={onView} />);
    fireEvent.click(screen.getByText('Sahana Sivaramakrishnan'));
    expect(onView).toHaveBeenCalledWith(tutor);
  });

  test('Edit and Deactivate do NOT also open the details modal', () => {
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<TutorTable tutors={tutors} onEdit={onEdit} onDelete={onDelete} onView={onView} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));

    expect(onEdit).toHaveBeenCalledWith(tutor);
    expect(onDelete).toHaveBeenCalledWith(tutor);
    expect(onView).not.toHaveBeenCalled();
  });

  test('the explicit View button opens details exactly once', () => {
    const onView = jest.fn();
    render(<TutorTable tutors={tutors} onEdit={jest.fn()} onDelete={jest.fn()} onView={onView} />);
    fireEvent.click(screen.getByRole('button', { name: 'View' }));
    expect(onView).toHaveBeenCalledTimes(1);
  });

  test('Enter on a focused row opens details', () => {
    const onView = jest.fn();
    render(<TutorTable tutors={tutors} onEdit={jest.fn()} onDelete={jest.fn()} onView={onView} />);
    fireEvent.keyDown(screen.getByRole('row', { name: /View details for Sahana/ }), { key: 'Enter' });
    expect(onView).toHaveBeenCalledWith(tutor);
  });

  test('table still works without onView (rows are not clickable)', () => {
    render(<TutorTable tutors={tutors} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.queryByRole('button', { name: 'View' })).not.toBeInTheDocument();
  });
});
