import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ dark = true }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`py-10 sm:py-12 mt-auto ${
        dark ? "bg-[#0b0f2f] border-t border-white/5" : "bg-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-purple to-primary-orange rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                LG
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase">
                LearnGevity
              </h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Empowering students through personalized tutoring and dedicated
              educators. Student-powered learning for success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wide text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/tutors"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Our Tutors
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wide text-sm">
              For Students
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/tutors"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Find a Tutor
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  View Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Book a Session
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wide text-sm">
              For Tutors
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/apply"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Tutor Login
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-primary-orange transition text-sm font-medium"
                >
                  Learn More
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} LearnGevity. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Students empowering students through quality education
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
