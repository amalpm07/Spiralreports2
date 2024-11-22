// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../ForgotPasswordModal';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const validateForm = () => {
    const errors = {
      username: { isValid: true, message: '' },
      password: { isValid: true, message: '' }
    };
    
    if (!formData.username) {
      errors.username = { isValid: false, message: 'Email is required' };
    } else if (!/\S+@\S+\.\S+/.test(formData.username)) {
      errors.username = { isValid: false, message: 'Please enter a valid email' };
    }
    
    if (!formData.password) {
      errors.password = { isValid: false, message: 'Password is required' };
    } else if (formData.password.length < 6) {
      errors.password = { isValid: false, message: 'Password must be at least 6 characters' };
    }
    
    return errors;
  };
  
  const validation = validateForm();
  const buttonEnabled = validation.username.isValid && validation.password.isValid;
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage('');
      
      window.location.href = 'https://app.spiralreports.com/api/auth/user/login/google';
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrorMessage('Failed to initialize Google sign-in. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!buttonEnabled) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Add your login API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      
      // Reset form after successful submission
      setFormData({ username: '', password: '' });
      setTouched({ username: false, password: false });
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('An error occurred during sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-600">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="username"
                type="email"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-all duration-200
                  ${(touched.username && !validation.username.isValid) ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
            </div>
            {touched.username && !validation.username.isValid && (
              <p className="mt-1 text-sm text-red-500">{validation.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg transition-all duration-200
                  ${(touched.password && !validation.password.isValid) ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {touched.password && !validation.password.isValid && (
              <p className="mt-1 text-sm text-red-500">{validation.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700" htmlFor="remember-me">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Forgot password?
          </button>
        </div>

        {errorMessage && (
          <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-md">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2.5 bg-red-500 text-white rounded-lg transition-all duration-300
            ${buttonEnabled ? 'hover:bg-red-600' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!buttonEnabled || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setErrorMessage('Sign up feature coming soon!')}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Sign up
          </button>
        </p>
      </form>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default LoginForm;