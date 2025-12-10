import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const TutorDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/tutor/dashboard" className="text-2xl font-bold text-primary-navy">
                LearnGevity Tutor
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary-navy mb-8">My Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* My Schedule Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="text-primary-purple text-4xl mr-4">📅</div>
              <div>
                <h2 className="text-xl font-bold text-primary-navy">My Schedule</h2>
                <p className="text-gray-600 text-sm">View your upcoming sessions</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No upcoming sessions</p>
              </div>
            </div>
          </div>

          {/* Manage Availability Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="text-primary-orange text-4xl mr-4">🚫</div>
              <div>
                <h2 className="text-xl font-bold text-primary-navy">Availability</h2>
                <p className="text-gray-600 text-sm">Block out unavailable times</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full bg-primary-purple text-white py-3 rounded-lg font-semibold hover:bg-opacity-90">
                Manage Availability
              </button>
            </div>
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-primary-navy mb-4">This Week</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-purple">--</div>
              <div className="text-gray-600 text-sm">Scheduled</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">--</div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-orange">--</div>
              <div className="text-gray-600 text-sm">Total Hours</div>
            </div>
          </div>
        </div>

        {/* Calendar View Placeholder */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-primary-navy mb-4">Calendar View</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Calendar view will be displayed here</p>
            <p className="text-gray-500 text-sm mt-2">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

