import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/learngevity-logo.png";

const Navbar = ({ dark = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, isTutor, signOut } = useAuth();

  // Filter out Apply link if user is logged in (they don't need to apply)
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/pricing", label: "Pricing" },
    { to: "/tutors", label: "Tutors" },
    { to: "/contact", label: "Contact Us" },
  ];

  const navLinks = user
    ? publicLinks
    : [
        ...publicLinks.slice(0, 4),
        { to: "/apply", label: "APPLY" },
        publicLinks[4],
      ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDashboardLink = () => {
    if (isAdmin()) return "/admin/dashboard";
    if (isTutor()) return "/tutor/dashboard";
    return null;
  };

  return (
    <nav
      className={`sticky top-0 z-50 ${
        dark
          ? "bg-primary-navy/80 backdrop-blur-md border-b border-white/10"
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo/Brand */}
          <Link
            to="/"
            className={`flex items-center gap-2 font-extrabold text-lg sm:text-xl ${
              dark ? "text-white" : "text-primary-navy"
            } hover:opacity-80 transition`}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
              <img
                src={Logo}
                alt="LearnGevity Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            LearnGevity
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-bold text-[0.9rem] uppercase tracking-wide px-3 xl:px-4 py-2 rounded-lg transition-all ${
                  isActive(link.to)
                    ? "bg-primary-purple text-white"
                    : dark
                    ? "text-white/90 hover:bg-white/5"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Show different options based on auth state */}
            {user ? (
              <>
                {/* Dashboard Link */}
                {getDashboardLink() && (
                  <Link
                    to={getDashboardLink()}
                    className="bg-gradient-to-r from-primary-orange to-[#ff8800] text-white px-5 py-2 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold uppercase text-xs ml-2"
                  >
                    Dashboard
                  </Link>
                )}

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-3 ml-2">
                  {/* User Avatar - First Letter */}
                  <div
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-orange to-primary-purple flex items-center justify-center text-white font-bold text-sm shadow-lg"
                    title={user.email}
                  >
                    {user.email?.charAt(0).toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-white/10 text-white px-5 py-2 rounded-lg hover:bg-white/20 transition-all font-bold uppercase text-xs border border-white/20"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary-purple to-primary-navy text-white px-5 py-2 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold uppercase text-xs ml-2"
              >
                Tutor Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition ${
              dark
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden py-4 border-t ${
              dark ? "border-white/10" : "border-gray-200"
            } animate-fade-in`}
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-bold text-sm uppercase tracking-wide px-4 py-3 rounded-lg transition-all ${
                    isActive(link.to)
                      ? "bg-primary-purple text-white"
                      : dark
                      ? "text-white/90 hover:bg-white/5"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth-based navigation for mobile */}
              {user ? (
                <>
                  {/* Dashboard Link */}
                  {getDashboardLink() && (
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-gradient-to-r from-primary-orange to-[#ff8800] text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all font-bold uppercase text-sm text-center mt-2"
                    >
                      Dashboard
                    </Link>
                  )}

                  {/* User Info */}
                  <div
                    className={`px-4 py-2 ${
                      dark ? "text-white/80" : "text-gray-600"
                    } text-sm text-center border-t ${
                      dark ? "border-white/10" : "border-gray-200"
                    } mt-2 pt-4`}
                  >
                    Logged in as: <strong>{user.email?.split("@")[0]}</strong>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-all font-bold uppercase text-sm border border-white/20 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-primary-purple to-primary-navy text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all font-bold uppercase text-sm text-center mt-2"
                >
                  Tutor Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
