import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Alert from "./Alert";
import { FaCheckCircle } from "react-icons/fa";

const pricingOptions = [
  {
    value: "private-online",
    label: "Private Session Online",
    rate: 180,
    type: "hourly",
  },
  {
    value: "private-inperson",
    label: "Private Session In-person (House call)",
    rate: 250,
    type: "hourly",
  },
  {
    value: "group-online",
    label: "Group Session Online (2+ students)",
    rate: 160,
    type: "hourly",
  },
  {
    value: "group-inperson",
    label: "Group Session In-person (House call, 2+ students)",
    rate: 220,
    type: "hourly",
  },
  {
    value: "bundle-10",
    label: "Bundle (10 private online sessions)",
    rate: 1620,
    type: "bundle",
  },
];

const BookingModal = ({ isOpen, onClose, tutor }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    lessonType: "private-online",
    sessions: 1,
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedOption = pricingOptions.find(
    (opt) => opt.value === formData.lessonType
  );
  const totalCost = selectedOption
    ? selectedOption.type === "bundle"
      ? selectedOption.rate
      : selectedOption.rate * formData.sessions
    : 0;

  // Auto-set sessions to 10 when bundle is selected
  useEffect(() => {
    if (formData.lessonType === "bundle-10") {
      setFormData((prev) => ({ ...prev, sessions: 10 }));
    }
  }, [formData.lessonType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions to proceed.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_BOOKING_TEMPLATE_ID,
        {
          to_name: "LearnGevity Admin",
          tutor_name: tutor.name,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          student_email: formData.email,
          subject: formData.subject,
          lesson_type: selectedOption?.label || formData.lessonType,
          num_sessions: formData.sessions,
          total_cost: `R${totalCost}`,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          subject: "",
          lessonType: "private-online",
          sessions: 1,
          acceptTerms: false,
        });
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        "Failed to submit booking. Please try again or contact us directly."
      );
      console.error("EmailJS error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-purple to-primary-navy text-white px-6 sm:px-8 py-5 sm:py-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
              Book a Session
            </h2>
            <p className="text-white/90 text-sm mt-1">with {tutor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1"
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
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-88px)] bg-gradient-to-br from-gray-50 to-white">
          {success ? (
            <div className="text-center py-12">
              <FaCheckCircle
                className="text-green-500 mx-auto mb-6"
                size={60}
              />
              <h3 className="text-2xl font-bold text-primary-navy mb-2">
                Booking Submitted!
              </h3>
              <p className="text-gray-600">
                We'll contact you shortly to confirm your session.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4">
                  <Alert
                    type="error"
                    message={error}
                    onClose={() => setError("")}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>

                {/* Lesson Type */}
                <div>
                  <label
                    htmlFor="lessonType"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Lesson Type *
                  </label>
                  <select
                    id="lessonType"
                    name="lessonType"
                    required
                    value={formData.lessonType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all"
                  >
                    {pricingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - R{option.rate}
                        {option.type === "hourly" ? "/hour" : " (10 sessions)"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Sessions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sessions"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Number of Sessions *
                    </label>
                    <input
                      type="number"
                      id="sessions"
                      name="sessions"
                      required
                      min="1"
                      value={formData.sessions}
                      onChange={handleChange}
                      disabled={formData.lessonType === "bundle-10"}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-base text-gray-900 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="1"
                    />
                  </div>

                  {/* Total Cost */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Total Cost
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border-2 border-primary-orange bg-primary-orange/5 text-lg font-bold text-primary-orange flex items-center justify-center">
                      R{totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-primary-purple focus:ring-primary-purple focus:ring-2 cursor-pointer"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      I have read and agree to the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        className="text-primary-purple font-bold hover:text-primary-orange underline"
                      >
                        Booking Terms, Conditions & Consent
                      </Link>{" "}
                      *
                    </label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl text-base font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.acceptTerms}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-purple to-primary-navy text-white rounded-xl text-base font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Submitting..." : "Submit Booking"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;
if (
  typeof document !== "undefined" &&
  !document.getElementById("booking-modal-styles")
) {
  style.id = "booking-modal-styles";
  document.head.appendChild(style);
}

export default BookingModal;
