import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin, isTutor } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate('/admin/dashboard');
      } else if (isTutor()) {
        navigate('/tutor/dashboard');
      }
    }
  }, [user, isAdmin, isTutor, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await signIn(email, password);
      
      // Get role directly from the returned data to avoid race condition
      const userRole = data.user?.user_metadata?.role;
      
      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'tutor') {
        navigate('/tutor/dashboard');
      } else {
        setError('No valid role found for this user');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027] flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-orange/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-gradient-to-br from-[#d8c7ff] to-primary-purple rounded-2xl p-8 sm:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-navy uppercase tracking-wide mb-2">
              LearnGevity
            </h1>
            <p className="text-primary-navy/80 text-lg">Tutor & Admin Login</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border-2 border-red-600 text-red-900 px-4 py-3 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-bold text-primary-navy mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                placeholder="admin@learngevity.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-primary-navy mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-none outline-none text-base bg-white/95 text-primary-navy shadow-md focus:shadow-[0_0_0_3px_rgba(106,76,255,0.5)] transition-shadow"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-4 bg-primary-navy text-white border-none rounded-xl text-xl font-bold mt-8 cursor-pointer transition-all hover:bg-primary-orange hover:text-primary-navy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-primary-navy/70 text-sm">
            <p>For tutors and administrators only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

