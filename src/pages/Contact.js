import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-navy mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600">We're here to answer your questions and help you get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-purple bg-opacity-10 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:info@learngevity.com" className="text-primary-purple hover:underline">
                    info@learngevity.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-purple bg-opacity-10 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href="tel:+15551234567" className="text-primary-purple hover:underline">
                    (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-purple bg-opacity-10 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                  <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Quick Links</h2>
            
            <div className="space-y-4">
              <Link 
                to="/tutors" 
                className="block p-4 bg-primary-purple bg-opacity-5 rounded-lg hover:bg-opacity-10 transition"
              >
                <h3 className="font-semibold text-primary-navy mb-1">Browse Our Tutors</h3>
                <p className="text-gray-600 text-sm">Find the perfect tutor for your needs</p>
              </Link>

              <Link 
                to="/apply" 
                className="block p-4 bg-primary-orange bg-opacity-5 rounded-lg hover:bg-opacity-10 transition"
              >
                <h3 className="font-semibold text-primary-navy mb-1">Become a Tutor</h3>
                <p className="text-gray-600 text-sm">Join our team of educators</p>
              </Link>

              <Link 
                to="/pricing" 
                className="block p-4 bg-primary-navy bg-opacity-5 rounded-lg hover:bg-opacity-10 transition"
              >
                <h3 className="font-semibold text-primary-navy mb-1">View Pricing</h3>
                <p className="text-gray-600 text-sm">Flexible options for every budget</p>
              </Link>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary-navy to-primary-purple rounded-lg text-white text-center">
              <h3 className="font-bold text-xl mb-2">Ready to Start?</h3>
              <p className="mb-4">Reach out today and let's discuss your learning goals</p>
              <a 
                href="mailto:info@learngevity.com"
                className="inline-block bg-white text-primary-purple px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;

