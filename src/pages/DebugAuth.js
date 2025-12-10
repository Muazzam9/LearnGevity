import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const DebugAuth = () => {
  const [authInfo, setAuthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAuthInfo({
          user: session.user,
          email: session.user.email,
          id: session.user.id,
          user_metadata: session.user.user_metadata,
          role: session.user.user_metadata?.role,
          raw_user_meta_data: session.user.raw_user_meta_data,
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!authInfo) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
        <p>Please log in first, then come back to this page.</p>
        <a href="/login" className="text-blue-600 underline">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Information</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Basic Info:</h2>
        <p><strong>Email:</strong> {authInfo.email}</p>
        <p><strong>User ID:</strong> {authInfo.id}</p>
        <p><strong>Role Detected:</strong> {authInfo.role || '❌ NO ROLE FOUND'}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">User Metadata (JSON):</h2>
        <pre className="bg-white p-3 rounded overflow-auto text-sm">
          {JSON.stringify(authInfo.user_metadata, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Raw User Meta Data (JSON):</h2>
        <pre className="bg-white p-3 rounded overflow-auto text-sm">
          {JSON.stringify(authInfo.raw_user_meta_data, null, 2)}
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Full User Object:</h2>
        <pre className="bg-white p-3 rounded overflow-auto text-sm max-h-96">
          {JSON.stringify(authInfo.user, null, 2)}
        </pre>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold mb-2">Expected Structure:</h3>
        <p className="mb-2">For the login to work, user_metadata should contain:</p>
        <pre className="bg-white p-3 rounded text-sm">
{`{
  "role": "admin"
}`}
        </pre>
      </div>
    </div>
  );
};

export default DebugAuth;

