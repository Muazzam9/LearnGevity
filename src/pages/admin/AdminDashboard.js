import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeTutors: 0,
    totalStudents: 0,
    weekSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const { count: tutorCount, error: tutorError } = await supabase
        .from("tutors")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (tutorError) throw tutorError;

      const { count: studentCount, error: studentError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (studentError) throw studentError;

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*");

      if (sessionsError) throw sessionsError;

      // Calculate this week's sessions
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const thisWeekSessions = sessionsData.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      // Count completed sessions (all time)
      const completedCount = sessionsData.filter(
        (s) => s.status === "completed"
      ).length;

      // Count upcoming sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingCount = sessionsData.filter((s) => {
        const sessionDate = new Date(s.date);
        return sessionDate >= today && s.status === "scheduled";
      }).length;

      setStats({
        activeTutors: tutorCount || 0,
        totalStudents: studentCount || 0,
        weekSessions: thisWeekSessions.length,
        completedSessions: completedCount,
        upcomingSessions: upcomingCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-navy to-[#061027]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-purple mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-navy mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome back! Here's an overview of your tutoring platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
        {/* Active Tutors */}
        <div className="bg-gradient-to-br from-primary-purple to-primary-purple/80 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FaChalkboardTeacher className="text-2xl sm:text-3xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.activeTutors}
          </div>
          <div className="text-xs sm:text-sm opacity-90">Active Tutors</div>
        </div>

        {/* Total Students */}
        <div className="bg-gradient-to-br from-primary-orange to-primary-orange/80 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FaUserGraduate className="text-2xl sm:text-3xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.totalStudents}
          </div>
          <div className="text-xs sm:text-sm opacity-90">Students</div>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-br from-primary-navy to-primary-navy/80 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-2xl sm:text-3xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.weekSessions}
          </div>
          <div className="text-xs sm:text-sm opacity-90">This Week</div>
        </div>

        {/* Completed */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-2xl sm:text-3xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.completedSessions}
          </div>
          <div className="text-xs sm:text-sm opacity-90">Completed</div>
        </div>

        {/* Upcoming */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-2xl sm:text-3xl opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.upcomingSessions}
          </div>
          <div className="text-xs sm:text-sm opacity-90">Upcoming</div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Tutor Management Card */}
        <Link
          to="/admin/tutors"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-purple"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-purple to-primary-purple/80 rounded-lg flex items-center justify-center">
              <FaChalkboardTeacher className="text-white text-2xl sm:text-3xl" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 group-hover:text-primary-purple transition-colors">
            Manage Tutors
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Add, edit, and manage tutor profiles and accounts
          </p>
          <div className="flex items-center text-primary-purple font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Go to Tutors
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Student Management Card */}
        <Link
          to="/admin/students"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-orange"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-lg flex items-center justify-center">
              <FaUserGraduate className="text-white text-2xl sm:text-3xl" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 group-hover:text-primary-orange transition-colors">
            Manage Students
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Add, edit, and track student information
          </p>
          <div className="flex items-center text-primary-orange font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Go to Students
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Session Management Card */}
        <Link
          to="/admin/sessions"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-navy"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-navy to-primary-navy/80 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-white text-2xl sm:text-3xl" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-primary-navy mb-2 group-hover:text-primary-navy transition-colors">
            Manage Sessions
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Schedule and manage tutoring sessions
          </p>
          <div className="flex items-center text-primary-navy font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Go to Sessions
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
