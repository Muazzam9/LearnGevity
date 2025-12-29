import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { formatDateTime } from '../../utils/dateHelpers';

const localizer = momentLocalizer(moment);

const SessionCalendar = ({ sessions, tutors, students, onSelectEvent, onSelectSlot }) => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  // Convert sessions to calendar events
  const events = useMemo(() => {
    return sessions.map(session => {
      const tutor = tutors.find(t => t.id === session.tutor_id);
      const student = students.find(s => s.id === session.student_id);

      // Combine date and start_time to create start datetime
      const startDateTime = new Date(`${session.date}T${session.start_time}`);
      
      // Calculate end datetime
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + session.duration);

      return {
        id: session.id,
        title: `${session.subject} - ${student ? `${student.first_name} ${student.last_name}` : 'Unknown'}`,
        start: startDateTime,
        end: endDateTime,
        resource: {
          ...session,
          tutorName: tutor?.name || 'Unknown Tutor',
          studentName: student ? `${student.first_name} ${student.last_name}` : 'Unknown Student',
        },
      };
    });
  }, [sessions, tutors, students]);

  // Color coding by tutor (generate color based on tutor ID)
  const eventStyleGetter = useCallback((event) => {
    const tutorId = event.resource.tutor_id;
    
    // Generate a consistent color for each tutor
    const hue = (tutorId?.charCodeAt(0) || 0) * 137.508; // Golden angle for good distribution
    const saturation = 60;
    const lightness = event.resource.status === 'completed' ? 40 : 60;

    const backgroundColor = `hsl(${hue % 360}, ${saturation}%, ${lightness}%)`;
    const borderColor = `hsl(${hue % 360}, ${saturation}%, ${lightness - 15}%)`;

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '4px',
        opacity: event.resource.status === 'cancelled' ? 0.5 : 1,
        color: '#fff',
        fontWeight: '500',
        fontSize: '0.875rem',
      },
    };
  }, []);

  // Custom event component to show more details
  const EventComponent = ({ event }) => {
    const { resource } = event;
    return (
      <div className="p-1">
        <div className="font-semibold">{event.title}</div>
        <div className="text-xs opacity-90">{resource.tutorName}</div>
        <div className="text-xs opacity-75">
          {resource.session_type} • {resource.delivery_mode}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="h-[700px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={onSelectEvent}
          onSelectSlot={onSelectSlot}
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            event: EventComponent,
          }}
          views={['month', 'week', 'day']}
          step={30}
          timeslots={2}
          defaultView="week"
          min={new Date(0, 0, 0, 7, 0, 0)} // 7am
          max={new Date(0, 0, 0, 21, 0, 0)} // 9pm
          toolbar={true}
          popup
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-purple rounded"></div>
          <span>Color-coded by tutor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 opacity-50 rounded"></div>
          <span>Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
};

export default SessionCalendar;

