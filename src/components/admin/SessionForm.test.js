import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { format, subDays, addDays } from 'date-fns';
import SessionForm from './SessionForm';

const mockInsert = jest.fn();
const mockUpdateEq = jest.fn();
const mockUpdate = jest.fn();

jest.mock('../../lib/supabaseClient', () => {
  const list = (data) => {
    const q = {
      select: () => q,
      eq: () => q,
      order: () => Promise.resolve({ data, error: null }),
    };
    return q;
  };
  return {
    supabase: {
      from: (table) => {
        if (table === 'tutors') {
          return list([{ id: 't1', name: 'Tutor One', subjects: ['Maths'] }]);
        }
        if (table === 'students') {
          return list([
            { id: 's1', first_name: 'Stu', last_name: 'Dent', subjects_needed: ['Maths'] },
          ]);
        }
        // sessions
        return {
          insert: (...args) => mockInsert(...args),
          update: (...args) => mockUpdate(...args),
        };
      },
    },
  };
});

jest.mock('../../utils/conflictDetection', () => ({
  checkForConflicts: jest.fn().mockResolvedValue({ hasConflict: false, conflicts: [] }),
  formatConflictMessage: jest.fn(() => ''),
}));

const ymd = (d) => format(d, 'yyyy-MM-dd');

const renderForm = async (props = {}) => {
  const onSuccess = jest.fn();
  const utils = render(<SessionForm onSuccess={onSuccess} onCancel={jest.fn()} {...props} />);
  await waitFor(() => expect(document.getElementById('tutor_id')).toBeInTheDocument());
  return { onSuccess, ...utils };
};

const submitWhenReady = async (label) => {
  const button = screen.getByRole('button', { name: label });
  await waitFor(() => expect(button).not.toBeDisabled());
  fireEvent.click(button);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockInsert.mockResolvedValue({ error: null });
  mockUpdateEq.mockResolvedValue({ error: null });
  mockUpdate.mockImplementation(() => ({ eq: mockUpdateEq }));
});

describe('SessionForm - past-dated sessions and status', () => {
  test('date input no longer blocks past dates (no min attribute)', async () => {
    await renderForm();
    expect(document.getElementById('date')).not.toHaveAttribute('min');
  });

  test('new sessions default to "scheduled" and all five statuses are offered', async () => {
    await renderForm();
    const status = document.getElementById('status');
    expect(status).toHaveValue('scheduled');
    const values = Array.from(status.options).map((o) => o.value);
    expect(values).toEqual(['scheduled', 'completed', 'cancelled', 'postponed', 'no-show']);
  });

  test('can create a session dated YESTERDAY with status "completed" (the reported case)', async () => {
    const { onSuccess } = await renderForm();
    const yesterday = ymd(subDays(new Date(), 1));

    fireEvent.change(document.getElementById('tutor_id'), { target: { value: 't1' } });
    fireEvent.change(document.getElementById('student_id'), { target: { value: 's1' } });
    fireEvent.change(document.getElementById('subject'), { target: { value: 'Maths' } });
    fireEvent.change(document.getElementById('date'), { target: { value: yesterday } });
    fireEvent.change(document.getElementById('start_time'), { target: { value: '15:00' } });
    fireEvent.change(document.getElementById('status'), { target: { value: 'completed' } });

    await submitWhenReady('Create Session');

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));
    const [[payload]] = mockInsert.mock.calls[0];
    expect(payload).toMatchObject({
      tutor_id: 't1',
      student_id: 's1',
      date: yesterday,
      start_time: '15:00',
      status: 'completed',
    });
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('Session created successfully!'));
  });

  test('a new future session is still saved as "scheduled" by default', async () => {
    await renderForm();
    const tomorrow = ymd(addDays(new Date(), 1));

    fireEvent.change(document.getElementById('tutor_id'), { target: { value: 't1' } });
    fireEvent.change(document.getElementById('student_id'), { target: { value: 's1' } });
    fireEvent.change(document.getElementById('subject'), { target: { value: 'Maths' } });
    fireEvent.change(document.getElementById('date'), { target: { value: tomorrow } });
    fireEvent.change(document.getElementById('start_time'), { target: { value: '10:00' } });

    await submitWhenReady('Create Session');

    await waitFor(() => expect(mockInsert).toHaveBeenCalledTimes(1));
    expect(mockInsert.mock.calls[0][0][0]).toMatchObject({ date: tomorrow, status: 'scheduled' });
  });

  test('editing a POSTPONED session keeps it postponed (regression: it used to reset to scheduled)', async () => {
    await renderForm({
      session: {
        id: 'sess1',
        tutor_id: 't1',
        student_id: 's1',
        subject: 'Maths',
        date: '2026-10-20',
        start_time: '15:00:00',
        duration: 60,
        session_type: 'private',
        delivery_mode: 'online',
        location: null,
        meeting_link: '',
        status: 'postponed',
      },
    });

    await waitFor(() => expect(document.getElementById('status')).toHaveValue('postponed'));
    // editing a past session must also be possible (was blocked by min=today)
    expect(document.getElementById('date')).toHaveValue('2026-10-20');

    fireEvent.change(document.getElementById('subject'), { target: { value: 'Maths revision' } });
    await submitWhenReady('Update Session');

    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1));
    expect(mockUpdate.mock.calls[0][0]).toMatchObject({
      subject: 'Maths revision',
      status: 'postponed',
    });
    expect(mockUpdateEq).toHaveBeenCalledWith('id', 'sess1');
  });

  test('status can be changed while editing', async () => {
    await renderForm({
      session: {
        id: 'sess2',
        tutor_id: 't1',
        student_id: 's1',
        subject: 'Maths',
        date: '2026-10-20',
        start_time: '15:00:00',
        duration: 60,
        session_type: 'private',
        delivery_mode: 'online',
        status: 'scheduled',
      },
    });
    await waitFor(() => expect(document.getElementById('date')).toHaveValue('2026-10-20'));
    fireEvent.change(document.getElementById('status'), { target: { value: 'completed' } });
    await submitWhenReady('Update Session');
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1));
    expect(mockUpdate.mock.calls[0][0].status).toBe('completed');
  });

  test('shows a hint (not a block) when a past session is still "scheduled"', async () => {
    await renderForm();
    fireEvent.change(document.getElementById('date'), {
      target: { value: ymd(subDays(new Date(), 1)) },
    });
    expect(screen.getByText(/This session is in the past/i)).toBeInTheDocument();

    fireEvent.change(document.getElementById('status'), { target: { value: 'completed' } });
    expect(screen.queryByText(/This session is in the past/i)).not.toBeInTheDocument();
  });

  test('no past-date hint for a future session', async () => {
    await renderForm();
    fireEvent.change(document.getElementById('date'), {
      target: { value: ymd(addDays(new Date(), 2)) },
    });
    expect(screen.queryByText(/This session is in the past/i)).not.toBeInTheDocument();
  });
});
