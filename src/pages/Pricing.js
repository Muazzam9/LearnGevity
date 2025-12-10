import React from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-navy">LearnGevity</Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-purple">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-purple">About</Link>
              <Link to="/pricing" className="text-primary-purple font-semibold">Pricing</Link>
              <Link to="/tutors" className="text-gray-700 hover:text-primary-purple">Tutors</Link>
              <Link to="/apply" className="text-gray-700 hover:text-primary-purple">Apply</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-purple">Contact</Link>
              <Link to="/login" className="bg-primary-purple text-white px-4 py-2 rounded-lg">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-navy mb-4">Flexible Pricing Options</h1>
          <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Single Session */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-primary-navy mb-4">Single Session</h3>
            <div className="text-4xl font-bold text-primary-purple mb-6">
              $50-75<span className="text-lg text-gray-600">/hour</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Pay as you go</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>No commitment</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Online or in-person</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Flexible scheduling</span>
              </li>
            </ul>
            <Link 
              to="/contact"
              className="block w-full text-center bg-gray-200 text-primary-navy py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Package Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-4 border-primary-purple transform scale-105">
            <div className="bg-primary-purple text-white text-center py-1 px-4 rounded-full inline-block mb-4">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-primary-navy mb-4">Package Plan</h3>
            <div className="text-4xl font-bold text-primary-purple mb-6">
              $45-65<span className="text-lg text-gray-600">/hour</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>10+ sessions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Save 10-15%</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Priority scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Progress tracking</span>
              </li>
            </ul>
            <Link 
              to="/contact"
              className="block w-full text-center bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Group Sessions */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-primary-navy mb-4">Group Sessions</h3>
            <div className="text-4xl font-bold text-primary-purple mb-6">
              $30-40<span className="text-lg text-gray-600">/hour</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Small groups (3-5 students)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Most affordable option</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Collaborative learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-orange mr-2">✓</span>
                <span>Subject-specific groups</span>
              </li>
            </ul>
            <Link 
              to="/contact"
              className="block w-full text-center bg-gray-200 text-primary-navy py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-4">
            * Exact rates vary by subject and tutor experience. Contact us for a personalized quote.
          </p>
          <p>
            All sessions include personalized learning materials and ongoing support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

