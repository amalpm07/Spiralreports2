import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';  // Import useNavigate here
import { AuthProvider, useAuth } from './hooks/AuthContext'; // Import your AuthProvider and useAuth
import AuthPage from './pages/AuthPage';
import HomePage from './pages/Home';
import Assessment from './pages/SearchPage';
import ToastNotifications from './components/ToastNotifications';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import ProtectedRoute from './components/ProtectedRoute';
import AddCredit from './components/cards/AddCreditsModal';
import Settings from './pages/SettingsPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentQuiz from './pages/AssessmentQuiz';
import PaymentCancelledScreen from './components/PaymentCancelledScreen';
import PaymentFailedScreen from './components/PaymentFailedScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import Dashboard from './pages/Dashboard';
import PasswordChangeScreen from './components/PasswordChangeScreen';
import AllInvoicePage from './pages/AllInvoicePage';
import SOC1Report from './pages/ReportPage'
import { UserProvider } from './context/UserContext';
import { isTokenExpired } from './utils/jwtUtils';  // Token check utility
import { handleRefreshToken } from './utils/auth';  // Function to call API and refresh token
import DraftAssessmentsPage from './pages/DraftAssessment';
import ReferralPage from './pages/ReferralPage';
import OAuthReturn from './types/OAuthReturn';
import GoogleCallback from './components/GoogleCallback';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          {/* Protected Routes */}
          <Route path="/assessment" element={<ProtectedRoute component={Assessment} />} />
          <Route path="/add-credits" element={<ProtectedRoute component={AddCredit} />} />
          <Route path='/settings' element={<ProtectedRoute component={Settings} />} />
          <Route path='/assessmentsPage' element={<ProtectedRoute component={AssessmentsPage} />} />
          <Route path='/assessmentsquiz' element={<ProtectedRoute component={AssessmentQuiz} />} />
          <Route path='/purchaseCancel' element={<PaymentCancelledScreen />} />
          <Route path='/purchaseFailed' element={<PaymentFailedScreen />} />
          <Route path='/purchaseSuccess' element={<PaymentSuccessScreen />} />
          <Route path='/dashboard' element={<ProtectedRoute component={Dashboard} />} />
          <Route path='/reset-password' element={<PasswordChangeScreen />} />
          <Route path='/invoices' element={<ProtectedRoute component={AllInvoicePage} />} />
          <Route path="/report/:assessmentId" element={<SOC1Report />} />
          <Route path="/report" element={<SOC1Report />} />
          <Route path='/drafts' element={<DraftAssessmentsPage/>}/>
          <Route path='/referral' element={<ReferralPage/>}/>
          <Route path="/api/auth/oauth/google" element={<GoogleCallback />} />      
            </Routes>
        <ToastNotifications />
        <ToastContainer />
      </UserProvider>
    </AuthProvider>
  );
}

// Component to handle redirection based on auth state
function AuthRedirect() {
  const { authData, setAuthData, isLoading } = useAuth(); // Get auth data from context
  const navigate = useNavigate();  // Use the navigate hook for redirection
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = authData?.access_token || authData?.accessToken;
      const refreshToken = authData?.refreshToken;
      const userId = authData?.userId;  // Assuming userId is part of your authData

      if (token) {
        if (isTokenExpired(token)) {
          // Token is expired, try to refresh it
          if (refreshToken && userId) {
            try {
              // Attempt to refresh the token using the refresh token and userId
              const newTokens = await handleRefreshToken(userId, refreshToken);

              // Save new tokens in your context or localStorage
              setAuthData({
                access_token: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
                userId: userId,  // Ensure userId is also updated
              });
            } catch (error) {
              console.error("Failed to refresh token, redirecting to login");
              // Clear auth data from context and redirect to login page
              setAuthData(null);  // Clear auth data
              navigate("/login");  // Redirect to login page
            }
          } else {
            console.error("No refresh token or userId found, redirecting to login");
            setAuthData(null);  // Clear auth data
            navigate("/login");  // Redirect to login page
          }
        }
      } else {
        console.error("No access token found, redirecting to login");
        navigate("/login");  // Redirect to login page
      }
    };

    if (!isLoading) {
      checkAuthToken();
    }
    setLoading(false);  // Ensure loading state is false once the auth check is done
  }, [authData, isLoading, setAuthData, navigate]);  // Ensure navigate is included in the dependency array

  if (loading) {
    return <div>Loading...</div>; // Optionally add a loading spinner here
  }

  // If logged in, redirect to the assessment page
  if (authData) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the home page
  return <HomePage />;
}

export default App;
