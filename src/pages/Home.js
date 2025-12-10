import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-navy">
              LearnGevity
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-purple">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary-purple">About</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-purple">Pricing</Link>
              <Link to="/tutors" className="text-gray-700 hover:text-primary-purple">Tutors</Link>
              <Link to="/apply" className="text-gray-700 hover:text-primary-purple">Apply</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary-purple">Contact</Link>
              <Link to="/login" className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-navy to-primary-purple text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Unlock Your Learning Potential
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with expert tutors who are passionate about helping you achieve your academic goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              to="/tutors" 
              className="bg-primary-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Find a Tutor
            </Link>
            <Link 
              to="/apply" 
              className="bg-white text-primary-navy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary-navy mb-12">
            Why Choose LearnGevity?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-purple text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">Expert Tutors</h3>
              <p className="text-gray-600">
                Our tutors are carefully selected and experienced in their subjects.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-orange text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                One-on-one and small group sessions tailored to your needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary-navy text-4xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Options</h3>
              <p className="text-gray-600">
                Choose between online or in-person sessions at your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-purple text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join hundreds of students achieving their goals with LearnGevity</p>
          <Link 
            to="/contact" 
            className="bg-white text-primary-purple px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Contact Us Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 LearnGevity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

