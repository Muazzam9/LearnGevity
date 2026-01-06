import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const tabs = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/admin/tutors", label: "Tutors", icon: FaChalkboardTeacher },
    { path: "/admin/students", label: "Students", icon: FaUserGraduate },
    { path: "/admin/sessions", label: "Sessions", icon: FaCalendarAlt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sticky Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Branding & Tabs */}
            <div className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto flex-1">
              {/* Brand */}
              <Link
                to="/admin/dashboard"
                className="flex-shrink-0 text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-purple to-primary-navy bg-clip-text text-transparent whitespace-nowrap"
              >
                <span className="hidden sm:inline">LearnGevity</span>
                <span className="sm:hidden">LG</span>
              </Link>

              {/* Tabs */}
              <div className="flex space-x-1 sm:space-x-2 lg:space-x-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = isActive(tab.path);

                  return (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 lg:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                        active
                          ? "bg-gradient-to-r from-primary-purple to-primary-navy text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="text-sm sm:text-base" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 ml-4">
              {/* Back to Website */}
              <Link
                to="/"
                className="hidden md:flex items-center gap-1.5 bg-primary-purple/10 text-primary-purple px-3 py-2 rounded-lg hover:bg-primary-purple/20 transition-colors text-xs font-semibold whitespace-nowrap border border-primary-purple/20"
                title="View Public Website"
              >
                <FaArrowLeft className="text-xs" />
                <span>Website</span>
              </Link>

              {/* Mobile: Back to Website Icon Only */}
              <Link
                to="/"
                className="md:hidden flex items-center justify-center w-9 h-9 bg-primary-purple/10 text-primary-purple rounded-lg hover:bg-primary-purple/20 transition-colors border border-primary-purple/20"
                title="View Public Website"
              >
                <FaArrowLeft className="text-xs" />
              </Link>

              {/* User Email - Hidden on small screens */}
              <span className="hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-purple text-white text-sm font-bold select-none">
                {(user?.email?.[0] || "").toUpperCase()}
              </span>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 text-xs sm:text-sm transition-colors font-semibold"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
