import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';
import { FaGoogle } from 'react-icons/fa'; // Import the Google icon
import ForgotPasswordModal from '../ForgotPasswordModal'; // Import the modal

const LoginForm = ({ formData, onInputChange, onSubmit, errorMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
        <p className="text-sm text-muted-foreground">Enter your username and password to login</p>
      </div>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <form onSubmit={onSubmit} className="grid gap-6">
        <div className="grid gap-2">
          <Input
            id="username"
            placeholder="name@example.com" // Corrected placeholder
            type="text"
            value={formData.username}
            onChange={onInputChange}
          />
          <Input
            id="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={onInputChange}
          />
          <Button
  variant="ghost"
  className="bg-red-300 text-white transition-colors duration-300 hover:bg-[#EF4444]"
  type="submit"
>
  Login
</Button>

        </div>
      </form>
      <div className="text-center mt-4">
        {/* Forgot Password Button Styled as a Link */}
        <button
          onClick={handleForgotPassword}
          className="text-red-600 hover:text-red-700 text-sm bg-transparent border-none cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <Separator />
      <Button variant="outline" className="flex items-center justify-center gap-2" onClick={handleGoogleLogin}>
        <FaGoogle className="text-lg" />
        Sign in with Google
      </Button>
    </>
  );
};

export default LoginForm;
