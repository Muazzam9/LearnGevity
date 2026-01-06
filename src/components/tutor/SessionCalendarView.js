import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const SessionCalendarView = ({ sessions, students, onSelectEvent }) => {
  // Convert sessions to FullCalendar events
  const events = useMemo(() => {
    return sessions.map((session) => {
      const student = students.find((s) => s.id === session.student_id);
      const studentName = student
        ? `${student.first_name} ${student.last_name}`
        : "Unknown";

      const startDateTime = new Date(`${session.date}T${session.start_time}`);

      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + session.duration);

      // Determine event color based on status
      let backgroundColor = "#6B46C1"; // primary purple
      let borderColor = "#6B46C1";

      if (session.status === "completed") {
        backgroundColor = "#10B981"; // green
        borderColor = "#10B981";
      } else if (session.status === "cancelled") {
        backgroundColor = "#EF4444"; // red
        borderColor = "#EF4444";
      } else if (session.status === "postponed") {
        backgroundColor = "#F59E0B"; // yellow/orange
        borderColor = "#F59E0B";
      } else if (session.status === "no-show") {
        backgroundColor = "#6B7280"; // gray
        borderColor = "#6B7280";
      }

      return {
        id: session.id,
        title: `${session.subject} - ${studentName}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor,
        borderColor,
        extendedProps: {
          ...session,
          studentName,
        },
      };
    });
  }, [sessions, students]);

  const handleEventClick = (info) => {
    onSelectEvent({
      resource: info.event.extendedProps,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <style>
        {`
          /* FullCalendar custom styling */
          .fc {
            font-family: 'Montserrat', sans-serif;
          }
          
          .fc-toolbar-title {
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1E3A8A !important;
          }
          
          .fc-button {
            background-color: #6B46C1 !important;
            border-color: #6B46C1 !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            font-size: 0.875rem !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.5rem !important;
          }
          
          .fc-button:hover {
            background-color: #1E3A8A !important;
            border-color: #1E3A8A !important;
          }
          
          .fc-button-primary:disabled {
            background-color: #9CA3AF !important;
            border-color: #9CA3AF !important;
          }
          
          .fc-button-active {
            background-color: #1E3A8A !important;
            border-color: #1E3A8A !important;
          }
          
          .fc-event {
            cursor: pointer !important;
            border-radius: 0.375rem !important;
            padding: 2px 4px !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
          }
          
          .fc-event:hover {
            opacity: 0.9 !important;
            transform: scale(1.02);
            transition: all 0.2s;
          }
          
          .fc-daygrid-event {
            white-space: normal !important;
          }
          
          .fc-col-header-cell {
            background-color: #F3F4F6 !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 0.75rem !important;
            padding: 0.75rem 0 !important;
          }
          
          .fc-day-today {
            background-color: #EDE9FE !important;
          }
          
          /* Mobile responsive improvements */
          @media (max-width: 768px) {
            .fc-toolbar {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            
            .fc-toolbar-chunk {
              display: flex !important;
              justify-content: center !important;
              width: 100% !important;
            }
            
            .fc-toolbar-title {
              font-size: 1.25rem !important;
            }
            
            .fc-button {
              font-size: 0.75rem !important;
              padding: 0.375rem 0.75rem !important;
            }
          }
        `}
      </style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        nowIndicator={true}
        weekends={true}
        editable={false}
        selectable={false}
        selectMirror={true}
        dayMaxEvents={true}
        eventDisplay="block"
        displayEventTime={true}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: "short",
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: "short",
        }}
        // Mobile-friendly settings
        dayHeaderFormat={{ weekday: "short", day: "numeric" }}
        views={{
          timeGridWeek: {
            titleFormat: { year: "numeric", month: "short", day: "numeric" },
          },
          timeGridDay: {
            titleFormat: { year: "numeric", month: "long", day: "numeric" },
          },
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
          },
        }}
      />

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Status Legend
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#6B46C1] rounded-full"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
            <span className="text-gray-600">Postponed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
            <span className="text-gray-600">No-Show</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCalendarView;
