import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import BookingModal from "../components/BookingModal";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Placeholder tutors for when database is empty
  const placeholderTutors = [
    {
      id: "placeholder-1",
      name: "Sahana Sivaramakrishnan",
      bio: "Experienced mathematics and physics tutor with a passion for helping students understand complex concepts. I specialize in breaking down difficult topics into manageable pieces and building confidence in problem-solving.",
      photo_url: "https://via.placeholder.com/150",
      subjects: ["Mathematics", "Physics", "Calculus", "Algebra"],
      areas: ["Johannesburg", "Sandton", "Rosebank"],
      hourly_rate: 180,
    },
    {
      id: "placeholder-2",
      name: "Sarah White",
      bio: "Physics and chemistry tutor passionate about making science accessible and exciting. I use real-world examples to help students connect theory with practical applications.",
      photo_url: "https://via.placeholder.com/150",
      subjects: ["Physics", "Chemistry", "Biology"],
      areas: ["Pretoria", "Centurion"],
      hourly_rate: 200,
    },
    {
      id: "placeholder-3",
      name: "Shahana",
      bio: "English and history tutor with strong communication skills. I help students improve their writing, critical thinking, and analytical abilities through engaging discussions and personalized feedback.",
      photo_url: "https://via.placeholder.com/150",
      subjects: ["English", "History", "Literature"],
      areas: ["Cape Town", "Stellenbosch"],
      hourly_rate: 160,
    },
  ];

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setTutors(data && data.length > 0 ? data : placeholderTutors);
    } catch (err) {
      setError(null); // Show placeholders instead of error
      setTutors(placeholderTutors);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (tutor) => {
    setSelectedTutor(tutor);
    setIsBookingModalOpen(true);
  };

  const handleReadMoreClick = (tutor) => {
    setSelectedTutor(tutor);
    setIsDetailsModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTutor(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleBookFromDetails = () => {
    setIsDetailsModalOpen(false);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[36vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20 inline-block">
            Meet our tutors
          </span>

          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-7"></div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight">
            Experienced Student Tutors
          </h1>

          <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed">
            Browse our tutors and book a session with someone who understands
            your course and learning style.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        {loading && <Loading text="Loading tutors..." />}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg max-w-2xl mx-auto backdrop-blur-sm">
            Error loading tutors: {error}
          </div>
        )}

        {!loading && tutors.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {tutors.map((tutor) => {
              const bioPreview =
                tutor.bio?.length > 120
                  ? tutor.bio.substring(0, 120) + "..."
                  : tutor.bio;

              return (
                <div
                  key={tutor.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-primary-purple/30 hover:shadow-2xl transition-all duration-300 group flex flex-col"
                >
                  <div className="flex flex-col sm:flex-row gap-5 p-5 flex-1">
                    {/* Photo */}
                    <div className="flex-shrink-0 flex justify-center sm:justify-start">
                      {tutor.photo_url ? (
                        <img
                          src={tutor.photo_url}
                          alt={tutor.name}
                          className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover border-4 border-primary-purple/30 group-hover:border-primary-orange/50 transition-all shadow-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-primary-purple to-primary-orange flex items-center justify-center text-4xl font-bold text-white border-4 border-white/20 shadow-lg ${
                          tutor.photo_url ? "hidden" : "flex"
                        }`}
                      >
                        {tutor.name.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* Name */}
                      <h3 className="text-white font-bold text-lg sm:text-xl mb-3 uppercase tracking-wide">
                        {tutor.name}
                      </h3>

                      {/* Subjects */}
                      {tutor.subjects && tutor.subjects.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {tutor.subjects
                              .slice(0, 3)
                              .map((subject, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-purple/30 to-primary-orange/30 text-white border border-primary-purple/40"
                                >
                                  {subject}
                                </span>
                              ))}
                            {tutor.subjects.length > 3 && (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white/60">
                                +{tutor.subjects.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Service Areas */}
                      {tutor.areas && tutor.areas.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-2 items-center">
                            <svg
                              className="w-3.5 h-3.5 text-primary-orange flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {tutor.areas.slice(0, 2).map((area, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center text-xs text-white/80"
                              >
                                {area}
                                {index <
                                  Math.min(tutor.areas.length, 2) - 1 && (
                                  <span className="mx-1.5">•</span>
                                )}
                              </span>
                            ))}
                            {tutor.areas.length > 2 && (
                              <span className="text-xs text-white/60">
                                +{tutor.areas.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      <div className="mb-4 flex-1">
                        {tutor.bio ? (
                          <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                            {bioPreview}
                          </p>
                        ) : (
                          <p className="text-white/40 text-sm leading-relaxed italic">
                            No description available.
                          </p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-auto flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleBookClick(tutor)}
                          className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-primary-purple to-primary-navy text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Book Session
                        </button>
                        <button
                          onClick={() => handleReadMoreClick(tutor)}
                          className="sm:w-auto inline-flex items-center justify-center text-white px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 border-2 border-white/30 hover:border-primary-orange hover:bg-white/5"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      {selectedTutor && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          tutor={selectedTutor}
        />
      )}

      {/* Tutor Details Modal */}
      {isDetailsModalOpen && selectedTutor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div className="bg-gradient-to-br from-primary-navy to-[#061027] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-purple to-primary-navy p-6 relative">
              <button
                onClick={handleCloseDetailsModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide pr-8">
                Tutor Profile
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* Photo */}
                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                  {selectedTutor.photo_url ? (
                    <img
                      src={selectedTutor.photo_url}
                      alt={selectedTutor.name}
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover border-4 border-primary-purple/30 shadow-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-primary-purple to-primary-orange flex items-center justify-center text-5xl font-bold text-white border-4 border-white/20 shadow-lg ${
                      selectedTutor.photo_url ? "hidden" : "flex"
                    }`}
                  >
                    {selectedTutor.name.charAt(0)}
                  </div>
                </div>

                {/* Name and Subjects */}
                <div className="flex-1">
                  <h3 className="text-white font-extrabold text-2xl sm:text-3xl mb-4 uppercase tracking-wide">
                    {selectedTutor.name}
                  </h3>

                  {selectedTutor.subjects &&
                    selectedTutor.subjects.length > 0 && (
                      <div>
                        <p className="text-primary-orange text-sm uppercase font-bold tracking-wider mb-3">
                          Subjects Taught
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTutor.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-purple/20 to-primary-orange/20 text-white border border-primary-purple/30"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Service Areas */}
              {selectedTutor.areas && selectedTutor.areas.length > 0 && (
                <div className="mb-6">
                  <p className="text-primary-orange text-sm uppercase font-bold tracking-wider mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Service Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.areas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/10 text-white/90 border border-white/20"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Bio */}
              {selectedTutor.bio && (
                <div className="mb-6">
                  <p className="text-primary-orange text-sm uppercase font-bold tracking-wider mb-3">
                    About
                  </p>
                  <p className="text-white/80 text-base leading-relaxed">
                    {selectedTutor.bio}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              {selectedTutor.hourly_rate && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-primary-orange text-sm uppercase font-bold tracking-wider mb-2">
                    Hourly Rate
                  </p>
                  <p className="text-white text-xl font-bold">
                    R{selectedTutor.hourly_rate}/hour
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBookFromDetails}
                className="flex-1 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide bg-gradient-to-r from-primary-purple to-primary-navy text-white hover:shadow-lg transition-all duration-300"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutors;
