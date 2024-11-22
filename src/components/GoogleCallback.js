// src/components/GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get the URL parameters
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const scope = urlParams.get('scope');
        
        // Log the received parameters (for debugging)
        console.log('Received Code:', code?.substring(0, 10) + '...');
        console.log('Received Scope:', scope);

        if (!code) {
          throw new Error('Authorization code not found');
        }

        // Make API request to exchange the code
        const response = await fetch('https://app.spiralreports.com/api/auth/oauth/google', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include credentials if needed
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to authenticate');
        }

        const data = await response.json();
        
        // If you receive tokens directly, store them
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }

        // Redirect to dashboard or home page
        navigate('/dashboard');
      } catch (error) {
        console.error('Authentication Error:', error);
        setError(error.message || 'Authentication failed');
        
        // Redirect to login after showing error
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              error: 'Authentication failed. Please try again.' 
            } 
          });
        }, 3000);
      }
    };

    processOAuthCallback();
  }, [location, navigate]);

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2 text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Completing Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we finish setting up your account...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;