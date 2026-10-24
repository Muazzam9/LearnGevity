import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Modal from "../Modal";
import { getTodayDate, formatDuration } from "../../utils/dateHelpers";
import {
  isUpcomingSession,
  formatBlockRange,
  formatSessionRange,
} from "../../utils/tutorSchedule";
import { FaBan, FaCalendarCheck, FaEnvelope, FaPhone } from "react-icons/fa";

const SectionTitle = ({ icon, title, count }) => (
  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary-navy mb-3">
    {icon}
    {title}
    {typeof count === "number" && (
      <span className="text-xs font-semibold text-gray-500 normal-case">
        ({count})
      </span>
    )}
  </h3>
);

const Spinner = ({ label }) => (
  <div className="text-center py-6">
    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary-purple mx-auto"></div>
    <p className="mt-2 text-sm text-gray-500">{label}</p>
  </div>
);

const ErrorBox = ({ message }) => (
  <div
    role="alert"
    className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg"
  >
    {message}
  </div>
);

const TutorDetailsModal = ({ tutor, isOpen, onClose, onEdit }) => {
  const [blocks, setBlocks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [blocksError, setBlocksError] = useState("");
  const [sessionsError, setSessionsError] = useState("");

  const tutorId = tutor?.id;

  useEffect(() => {
    if (!isOpen || !tutorId) return undefined;

    // Ignore results that arrive after the modal was closed / another tutor opened
    let cancelled = false;

    setBlocks([]);
    setSessions([]);
    setBlocksError("");
    setSessionsError("");
    setLoadingBlocks(true);
    setLoadingSessions(true);

    const loadBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from("tutor_availability_blocks")
          .select("*")
          .eq("tutor_id", tutorId)
          .gte("end_datetime", new Date().toISOString())
          .order("start_datetime");
        if (error) throw error;
        if (!cancelled) setBlocks(data || []);
      } catch (err) {
        console.error("Error loading blocked times:", err);
        if (!cancelled) {
          setBlocksError(
            `Could not load blocked times${err?.message ? `: ${err.message}` : "."}`
          );
        }
      } finally {
        if (!cancelled) setLoadingBlocks(false);
      }
    };

    const loadSessions = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select(
            "id, subject, date, start_time, duration, status, session_type, delivery_mode, student:students(first_name, last_name)"
          )
          .eq("tutor_id", tutorId)
          .eq("status", "scheduled")
          .gte("date", getTodayDate())
          .order("date")
          .order("start_time");
        if (error) throw error;
        if (!cancelled) {
          setSessions((data || []).filter((s) => isUpcomingSession(s)));
        }
      } catch (err) {
        console.error("Error loading upcoming sessions:", err);
        if (!cancelled) {
          setSessionsError(
            `Could not load upcoming sessions${err?.message ? `: ${err.message}` : "."}`
          );
        }
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    };

    loadBlocks();
    loadSessions();

    return () => {
      cancelled = true;
    };
  }, [isOpen, tutorId]);

  if (!tutor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tutor Details" size="lg">
      <div className="space-y-8">
        {/* Profile */}
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-shrink-0">
            {tutor.photo_url ? (
              <img
                src={tutor.photo_url}
                alt={tutor.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-primary-purple bg-opacity-20 flex items-center justify-center text-primary-purple text-3xl font-bold">
                {tutor.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  tutor.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {tutor.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              {tutor.email && (
                <p className="flex items-center gap-2 break-all">
                  <FaEnvelope className="text-primary-orange flex-shrink-0" />
                  <a href={`mailto:${tutor.email}`} className="hover:underline">
                    {tutor.email}
                  </a>
                </p>
              )}
              {tutor.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-primary-orange flex-shrink-0" />
                  <a href={`tel:${tutor.phone}`} className="hover:underline">
                    {tutor.phone}
                  </a>
                </p>
              )}
              {tutor.hourly_rate != null && tutor.hourly_rate !== "" && (
                <p className="font-semibold text-primary-orange">
                  R{tutor.hourly_rate}/hr
                </p>
              )}
            </div>

            {(tutor.subjects || []).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tutor.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-purple bg-opacity-10 text-primary-purple"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}

            {(tutor.areas || []).length > 0 && (
              <p className="text-sm text-gray-600 mt-3">
                <span className="font-semibold">Service areas: </span>
                {tutor.areas.join(", ")}
              </p>
            )}
          </div>
        </div>

        {tutor.bio && (
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {tutor.bio}
          </p>
        )}

        {/* Blocked times */}
        <section aria-label="Blocked times">
          <SectionTitle
            icon={<FaBan className="text-red-500" />}
            title="Blocked-out times"
            count={loadingBlocks || blocksError ? undefined : blocks.length}
          />
          {loadingBlocks ? (
            <Spinner label="Loading blocked times..." />
          ) : blocksError ? (
            <ErrorBox message={blocksError} />
          ) : blocks.length === 0 ? (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
              No upcoming blocked times. This tutor has not blocked out any
              time.
            </p>
          ) : (
            <ul className="divide-y border border-gray-200 rounded-lg">
              {blocks.map((block) => (
                <li key={block.id} className="p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {formatBlockRange(block.start_datetime, block.end_datetime)}
                  </p>
                  {block.reason && (
                    <p className="text-xs text-gray-600 mt-1">{block.reason}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming sessions */}
        <section aria-label="Upcoming sessions">
          <SectionTitle
            icon={<FaCalendarCheck className="text-primary-purple" />}
            title="Upcoming sessions"
            count={
              loadingSessions || sessionsError ? undefined : sessions.length
            }
          />
          {loadingSessions ? (
            <Spinner label="Loading upcoming sessions..." />
          ) : sessionsError ? (
            <ErrorBox message={sessionsError} />
          ) : sessions.length === 0 ? (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
              No upcoming scheduled sessions.
            </p>
          ) : (
            <ul className="divide-y border border-gray-200 rounded-lg">
              {sessions.map((session) => {
                const studentName = session.student
                  ? `${session.student.first_name} ${session.student.last_name}`
                  : "Unknown student";
                return (
                  <li key={session.id} className="p-3">
                    <p className="text-sm font-medium text-gray-900">
                      {formatSessionRange(session)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {session.subject} · {studentName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {formatDuration(session.duration)} ·{" "}
                      {session.session_type} · {session.delivery_mode}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <button
            onClick={() => onEdit(tutor)}
            className="flex-1 bg-gradient-to-r from-primary-purple to-primary-navy text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300"
          >
            Edit Tutor
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TutorDetailsModal;
