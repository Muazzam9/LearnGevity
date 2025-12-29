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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Placeholder tutors for when database is empty
  const placeholderTutors = [
    {
      id: "placeholder-1",
      name: "Sahana Sivaramakrishnan",
      bio: "Math tutor with 5 years experience.",
      photo_url: "https://via.placeholder.com/150",
    },
    {
      id: "placeholder-2",
      name: "Sarah White",
      bio: "Physics tutor passionate about science.",
      photo_url: "https://via.placeholder.com/150",
    },
    {
      id: "placeholder-3",
      name: "Shahana",
      bio: "English tutor with strong communication skills.",
      photo_url: "https://via.placeholder.com/150",
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTutor(null);
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-primary-purple/30 hover:-translate-y-2 transition-all duration-300 group min-h-[420px] flex flex-col"
              >
                {/* Photo */}
                <div className="flex justify-center pt-10 pb-6">
                  {tutor.photo_url ? (
                    <img
                      src={tutor.photo_url}
                      alt={tutor.name}
                      className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover border-4 border-primary-purple/30 group-hover:border-primary-orange/50 transition-all shadow-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-primary-purple to-primary-orange flex items-center justify-center text-5xl sm:text-6xl font-bold text-white border-4 border-white/20 shadow-xl">
                      {tutor.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-6 pb-8 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-4 uppercase tracking-wide">
                      {tutor.name}
                    </h3>
                    <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed min-h-[60px]">
                      {tutor.bio}
                    </p>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookClick(tutor)}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-primary-purple to-primary-navy text-white px-8 py-3 rounded-full font-bold text-base uppercase tracking-wide hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      {selectedTutor && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tutor={selectedTutor}
        />
      )}
    </div>
  );
};

export default Tutors;
