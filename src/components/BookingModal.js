import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Alert from './Alert';

const BookingModal = ({ isOpen, onClose, tutor }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    lessonType: 'Online',
    sessions: '1',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_BOOKING_TEMPLATE_ID, // Use different template
        {
          to_name: 'LearnGevity Admin',
          tutor_name: tutor.name,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          student_email: formData.email,
          subject: formData.subject,
          lesson_type: formData.lessonType,
          num_sessions: formData.sessions,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          subject: '',
          lessonType: 'Online',
          sessions: '1',
        });
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to submit booking. Please try again or contact us directly.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-[#d8c7ff] to-primary-purple rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-primary-navy text-white px-6 sm:px-8 py-4 sm:py-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
              Book a Session
            </h2>
            <p className="text-white/80 text-sm mt-1">with {tutor.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-primary-navy mb-2">Booking Submitted!</h3>
              <p className="text-primary-navy/80">We'll contact you shortly to confirm your session.</p>
            </div>
          ) : (
            <>
              {error && (
                <Alert 
                  type="error" 
                  message={error}
                  onClose={() => setError('')}
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-lg font-bold text-primary-navy mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-lg font-bold text-primary-navy mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-lg font-bold text-primary-navy mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-lg font-bold text-primary-navy mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-lg font-bold text-primary-navy mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>

                {/* Lesson Type & Number of Sessions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lessonType" className="block text-lg font-bold text-primary-navy mb-2">
                      Lesson Type *
                    </label>
                    <select
                      id="lessonType"
                      name="lessonType"
                      required
                      value={formData.lessonType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                    >
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sessions" className="block text-lg font-bold text-primary-navy mb-2">
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
                      className="w-full px-4 py-3 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/20 text-primary-navy border-2 border-primary-navy rounded-xl text-base font-bold hover:bg-white/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-primary-navy text-white border-none rounded-xl text-base font-bold hover:bg-primary-orange hover:text-primary-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Booking'}
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

export default BookingModal;

