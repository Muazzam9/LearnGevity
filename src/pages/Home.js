import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[72vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-orange/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-block animate-fade-in">
            <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20">
              Welcome to LearnGevity
            </span>
          </div>

          {/* Divider */}
          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-8"></div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight animate-fade-in-up">
            Students Empowering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple">
              Students
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto mb-8 sm:mb-10 text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed px-4 animate-fade-in-up delay-200">
            Student-powered tutoring that connects you with subject specialists
            — affordable, reliable, and tailored to help you succeed.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up delay-300">
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-gradient-to-r from-primary-purple via-[#5a3aef] to-primary-navy text-white px-7 sm:px-9 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-2xl shadow-primary-purple/30 hover:-translate-y-1 hover:shadow-3xl hover:shadow-primary-purple/40 transition-all duration-300 ease-out group"
            >
              Become a student
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-black -mt-8 sm:-mt-12 pt-12 sm:pt-14 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 rounded-t-2xl sm:rounded-t-3xl relative shadow-[0_-10px_60px_rgba(2,6,23,0.25)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 sm:gap-8 lg:gap-9 items-start">
            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6 rounded-xl min-h-[170px] flex flex-col gap-2.5 border border-gray-100 hover:border-primary-purple/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-primary-purple/5 border-2 border-primary-purple/10 flex items-center justify-center text-primary-purple font-extrabold text-2xl mb-2 group-hover:scale-110 group-hover:bg-primary-purple/10 transition-all duration-300">
                  Q
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black">
                  High Quality Tutoring
                </h3>
                <div className="text-xs sm:text-sm text-primary-purple font-bold">
                  What to expect
                </div>
                <p className="text-sm text-black/80 leading-relaxed">
                  Friendly tutors who understand student life and learning
                  challenges. Sessions tailored to your pace.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6 rounded-xl min-h-[170px] flex flex-col gap-2.5 border border-gray-100 hover:border-primary-purple/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-primary-purple/5 border-2 border-primary-purple/10 flex items-center justify-center text-primary-purple font-extrabold text-2xl mb-2 group-hover:scale-110 group-hover:bg-primary-purple/10 transition-all duration-300">
                  C
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black">
                  CONNECT
                </h3>
                <div className="text-xs sm:text-sm text-primary-purple font-bold">
                  Contact members
                </div>
                <p className="text-sm text-black/80 leading-relaxed">
                  Quick booking and reliable communication. Find the right tutor
                  in minutes and start improving.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6 rounded-xl min-h-[170px] flex flex-col gap-2.5 border border-gray-100 hover:border-primary-purple/20 hover:shadow-lg transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 rounded-xl bg-primary-purple/5 border-2 border-primary-purple/10 flex items-center justify-center text-primary-purple font-extrabold text-2xl mb-2 group-hover:scale-110 group-hover:bg-primary-purple/10 transition-all duration-300">
                  A
                </div>
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-black">
                  Affordability
                </h3>
                <div className="text-xs sm:text-sm text-primary-purple font-bold">
                  Expand your knowledge on a budget
                </div>
                <p className="text-sm text-black/80 leading-relaxed">
                  We promote a respectful, safe learning environment where
                  tutors and students thrive.
                </p>
              </div>
            </div>

            {/* Side Card */}
            <aside className="bg-gradient-to-br from-primary-purple via-[#5a3aef] to-[#4b2cff] text-white p-6 sm:p-7 rounded-xl shadow-xl shadow-primary-purple/20 relative border border-white/10 hover:shadow-2xl hover:shadow-primary-purple/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              <h3 className="text-base sm:text-lg font-extrabold mb-3 uppercase tracking-wide relative z-10">
                A tutor should live for the glory of learning
              </h3>
              <p className="text-white/95 leading-relaxed text-sm sm:text-base relative z-10">
                High-quality tutoring, accessible pricing, and a supportive
                community — LearnGevity brings opportunities for students who
                want to teach and learn.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* Why LearnGevity Section */}
      <main className="max-w-5xl mx-auto my-12 sm:my-16 lg:my-20 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 text-white/95">
        <div className="text-center sm:text-left">
          <h2 className="text-primary-orange mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Why LearnGevity?
          </h2>
          <p className="text-white/95 leading-relaxed text-base sm:text-lg lg:text-xl max-w-3xl">
            We match learners with university students who are talented at the
            subjects they teach — a practical, affordable path to better grades.
          </p>
        </div>

        {/* Additional CTAs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12">
          <Link
            to="/tutors"
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-purple/30 transition-all duration-300"
          >
            <div className="text-primary-orange text-3xl mb-3"></div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-orange transition-colors">
              Browse Tutors
            </h3>
            <p className="text-white/70 text-sm">
              Find the perfect tutor for your subject
            </p>
          </Link>

          <Link
            to="/pricing"
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-purple/30 transition-all duration-300"
          >
            <div className="text-primary-purple text-3xl mb-3"></div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-orange transition-colors">
              View Pricing
            </h3>
            <p className="text-white/70 text-sm">
              Affordable rates for every budget
            </p>
          </Link>

          <Link
            to="/contact"
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-purple/30 transition-all duration-300 sm:col-span-2 lg:col-span-1"
          >
            <div className="text-primary-orange text-3xl mb-3"></div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-orange transition-colors">
              Get in Touch
            </h3>
            <p className="text-white/70 text-sm">
              Have questions? We're here to help
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
