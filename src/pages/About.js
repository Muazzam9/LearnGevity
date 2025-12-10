import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - will be extracted to component later */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-navy">LearnGevity</Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-purple">Home</Link>
              <Link to="/about" className="text-primary-purple font-semibold">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-purple">Pricing</Link>
              <Link to="/tutors" className="text-gray-700 hover:text-primary-purple">Tutors</Link>
              <Link to="/apply" className="text-gray-700 hover:text-primary-purple">Apply</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-purple">Contact</Link>
              <Link to="/login" className="bg-primary-purple text-white px-4 py-2 rounded-lg">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary-navy mb-8">About LearnGevity</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-primary-purple mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At LearnGevity, we believe that every student deserves access to quality education and personalized support. 
            Our mission is to connect passionate tutors with motivated learners, creating an environment where academic 
            excellence thrives.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-primary-purple mb-4">Our Approach</h2>
          <p className="text-gray-700 mb-4">
            We carefully select experienced tutors who are not only experts in their subjects but also skilled at making 
            learning engaging and effective. Our flexible approach allows students to learn at their own pace, whether 
            online or in-person.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-primary-purple mb-4">Why LearnGevity?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">✓</span>
              Carefully vetted, experienced tutors
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">✓</span>
              Personalized learning plans tailored to each student
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">✓</span>
              Flexible scheduling to fit your lifestyle
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">✓</span>
              Both online and in-person options available
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-2">✓</span>
              Ongoing support and progress tracking
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

