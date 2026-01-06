import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MySchedule = ({ sessions, students, onSelectEvent }) => {
  // Convert sessions to calendar events
  const events = useMemo(() => {
    return sessions.map(session => {
      const student = students.find(s => s.id === session.student_id);

      const startDateTime = new Date(`${session.date}T${session.start_time}`);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + session.duration);

      return {
        id: session.id,
        title: `${session.subject} - ${student ? `${student.first_name} ${student.last_name}` : 'Unknown'}`,
        start: startDateTime,
        end: endDateTime,
        resource: {
          ...session,
          studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        },
      };
    });
  }, [sessions, students]);

  // Style completed vs scheduled sessions
  const eventStyleGetter = (event) => {
    const isCompleted = event.resource.status === 'completed';
    const isCancelled = event.resource.status === 'cancelled';

    let backgroundColor = '#6B46C1'; // primary purple
    
    if (isCompleted) {
      backgroundColor = '#10B981'; // green
    } else if (isCancelled) {
      backgroundColor = '#6B7280'; // gray
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: isCancelled ? 0.6 : 1,
        color: '#fff',
        border: 'none',
        display: 'block',
      },
    };
  };

  const EventComponent = ({ event }) => {
    const { resource } = event;
    return (
      <div className="p-1">
        <div className="font-semibold text-sm">{event.title}</div>
        <div className="text-xs opacity-90">
          {resource.session_type} • {resource.delivery_mode}
        </div>
        {resource.status === 'completed' && (
          <div className="text-xs opacity-75">✓ Completed</div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          views={['month', 'week', 'day']}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
          toolbar={true}
          popup
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-purple rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 opacity-60 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;

