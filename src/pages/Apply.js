import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Apply = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    experience: "",
    availability: "Less than 5 hours",
    tutorLevel: "Primary",
    schoolSubjects: "",
    uniCourses: "",
    mode: "Online",
    areas: "",
    matricLink: "",
    transcriptLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_name: "LearnGevity Admin",
          from_name: formData.fullName,
          from_email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          availability: formData.availability,
          tutor_level: formData.tutorLevel,
          school_subjects: formData.schoolSubjects || "N/A",
          uni_courses: formData.uniCourses || "N/A",
          mode: formData.mode,
          areas: formData.areas || "N/A",
          matric_link: formData.matricLink || "Not provided",
          transcript_link: formData.transcriptLink || "Not provided",
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        experience: "",
        availability: "Less than 5 hours",
        tutorLevel: "Primary",
        schoolSubjects: "",
        uniCourses: "",
        mode: "Online",
        areas: "",
        matricLink: "",
        transcriptLink: "",
      });
    } catch (err) {
      setError(
        "Failed to submit application. Please try again or contact us directly."
      );
      console.error("EmailJS error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Application Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full max-w-3xl">
          {success ? (
            <div className="bg-gradient-to-br from-[#d8c7ff] to-primary-purple rounded-2xl p-8 sm:p-12 shadow-2xl text-center animate-fade-in">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-navy mb-4 uppercase">
                Application Submitted
              </h2>
              <p className="text-primary-navy/90 text-lg leading-relaxed">
                Thank you for applying to become a LearnGevity tutor! You will
                receive feedback very soon.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#d8c7ff] to-primary-purple rounded-2xl p-6 sm:p-10 shadow-2xl animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-navy text-center mb-8 uppercase tracking-wide">
                Become a LearnGevity Tutor
              </h1>

              {error && (
                <div className="mb-6 bg-red-500/20 border-2 border-red-600 text-red-900 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Tutoring Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Tutoring Experience *
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="e.g., 2 years of online tutoring"
                  />
                </div>

                {/* Weekly Availability */}
                <div>
                  <label
                    htmlFor="availability"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Your Weekly Availability *
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    required
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                  >
                    <option value="Less than 5 hours">Less than 5 hours</option>
                    <option value="Between 5–10 hours">
                      Between 5–10 hours
                    </option>
                    <option value="More than 10 hours">
                      More than 10 hours
                    </option>
                  </select>
                </div>

                {/* Tutor Level */}
                <div>
                  <label
                    htmlFor="tutorLevel"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Tutor Level *
                  </label>
                  <select
                    id="tutorLevel"
                    name="tutorLevel"
                    required
                    value={formData.tutorLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                  >
                    <option value="Primary">Primary School</option>
                    <option value="High School">High School</option>
                    <option value="University">University</option>
                    <option value="All">All of the Above</option>
                  </select>
                </div>

                {/* Matric Certificate Google Drive Link */}
                <div>
                  <label
                    htmlFor="matricLink"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Matric Certificate (Google Drive Link)
                  </label>
                  <input
                    type="url"
                    id="matricLink"
                    name="matricLink"
                    value={formData.matricLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                {/* University Transcript Google Drive Link */}
                <div>
                  <label
                    htmlFor="transcriptLink"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    University Transcript (Google Drive Link)
                  </label>
                  <input
                    type="url"
                    id="transcriptLink"
                    name="transcriptLink"
                    value={formData.transcriptLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                  <div className="mt-2 p-3 bg-primary-orange/10 border-l-4 border-primary-orange rounded">
                    <p className="text-sm text-primary-navy leading-relaxed">
                      <strong className="text-primary-orange">
                        How to share:
                      </strong>
                      <br />
                      1. Upload your document to Google Drive
                      <br />
                      2. Right-click the file → <strong>Get link</strong>
                      <br />
                      3. Change to <strong>"Anyone with the link"</strong> (make
                      it public)
                      <br />
                      4. Click <strong>Copy link</strong> and paste it above
                    </p>
                  </div>
                </div>

                {/* High School Subjects */}
                <div>
                  <label
                    htmlFor="schoolSubjects"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    High School Subjects
                  </label>
                  <input
                    type="text"
                    id="schoolSubjects"
                    name="schoolSubjects"
                    value={formData.schoolSubjects}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="e.g., Math, Physics, English"
                  />
                </div>

                {/* University Courses */}
                <div>
                  <label
                    htmlFor="uniCourses"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    University Courses (if any)
                  </label>
                  <input
                    type="text"
                    id="uniCourses"
                    name="uniCourses"
                    value={formData.uniCourses}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="e.g., Calculus I, Data Structures"
                  />
                </div>

                {/* Mode */}
                <div>
                  <label
                    htmlFor="mode"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Mode *
                  </label>
                  <select
                    id="mode"
                    name="mode"
                    required
                    value={formData.mode}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                  >
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Areas */}
                <div>
                  <label
                    htmlFor="areas"
                    className="block text-lg font-bold text-primary-navy mb-2"
                  >
                    Areas (if in-person)
                  </label>
                  <input
                    type="text"
                    id="areas"
                    name="areas"
                    value={formData.areas}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="e.g., Cape Town, Durban"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-4 bg-primary-navy text-white border-none rounded-xl text-xl font-bold mt-8 cursor-pointer transition-all hover:bg-primary-orange hover:text-primary-navy disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
