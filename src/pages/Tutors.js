import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTutors(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-navy mb-4">Our Expert Tutors</h1>
          <p className="text-xl text-gray-600">Meet the passionate educators ready to help you succeed</p>
        </div>

        {loading && <Loading text="Loading tutors..." />}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-2xl mx-auto">
            Error loading tutors: {error}
          </div>
        )}

        {!loading && !error && tutors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tutors available at the moment. Check back soon!</p>
          </div>
        )}

        {!loading && !error && tutors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-primary-navy to-primary-purple flex items-center justify-center">
                  {tutor.photo_url ? (
                    <img 
                      src={tutor.photo_url} 
                      alt={tutor.name} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-primary-purple">
                      {tutor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary-navy mb-2">{tutor.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tutor.subjects && tutor.subjects.map((subject, idx) => (
                      <span key={idx} className="bg-primary-purple bg-opacity-10 text-primary-purple px-3 py-1 rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{tutor.bio}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-2xl font-bold text-primary-orange">
                      ${tutor.hourly_rate}<span className="text-sm text-gray-600">/hr</span>
                    </span>
                    <Link 
                      to="/contact" 
                      className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Don't see the right tutor for your needs?</p>
          <Link 
            to="/contact"
            className="inline-block bg-primary-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tutors;

