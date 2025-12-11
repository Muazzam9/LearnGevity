import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Alert from '../components/Alert';

const Apply = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: '',
    bio: '',
    whyInterested: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_name: 'LearnGevity Admin',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subjects: formData.subjects,
          bio: formData.bio,
          why_interested: formData.whyInterested,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subjects: '',
        bio: '',
        whyInterested: '',
      });
    } catch (err) {
      setError('Failed to submit application. Please try again or contact us directly.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-navy mb-4">Become a Tutor</h1>
          <p className="text-xl text-gray-600">Join our team of passionate educators</p>
        </div>

        {success && (
          <Alert 
            type="success" 
            message={
              <>
                <strong>Application Submitted Successfully!</strong>
                <p className="mt-1">Thank you for your interest. We'll review your application and get back to you soon.</p>
              </>
            }
            onClose={() => setSuccess(false)}
          />
        )}

        {error && (
          <Alert 
            type="error" 
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-2">
                Subjects You Can Teach *
              </label>
              <input
                type="text"
                id="subjects"
                name="subjects"
                required
                value={formData.subjects}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="e.g., Math, Science, English"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Brief Bio & Teaching Experience *
              </label>
              <textarea
                id="bio"
                name="bio"
                required
                rows="4"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="Tell us about your education background and teaching experience..."
              />
            </div>

            <div>
              <label htmlFor="whyInterested" className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to join LearnGevity? *
              </label>
              <textarea
                id="whyInterested"
                name="whyInterested"
                required
                rows="4"
                value={formData.whyInterested}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                placeholder="Share your motivation and what makes you a great fit..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>Have questions? <Link to="/contact" className="text-primary-purple hover:underline">Contact us</Link></p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Apply;

