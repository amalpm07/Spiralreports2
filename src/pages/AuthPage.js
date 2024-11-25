import React, { useState, useEffect } from "react";
import LoginForm from "../components/forms/LoginForm";
import CreateAccountForm from "../components/forms/CreateAccountForm";
import { useNavigate, Link, useLocation } from "react-router-dom"; 
import log from '../assets/SpiralReports Logo White.jpg'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import OTPPopup from "../components/cards/OtpPopup"; 
import { useAuth } from '../hooks/AuthContext'; 
import useUserProfile from "../hooks/useUserProfile";
import PageLoader from "../components/ui/PageLoader";

function AuthPage() {
  const { setAuthData } = useAuth(); 
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { userData, loading, error } = useUserProfile();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("https://app.spiralreports.com/api/auth/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      setUserId(data.data._id);
      setAuthData(data.data);
      localStorage.setItem('authData', JSON.stringify(data.data));
      toast.success("Login successful! Please verify your OTP.", { position: "bottom-right" });
      setIsOtpOpen(true);

    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message, { position: "bottom-right" });
    }
  };

  const handleOtpSubmit = async (otp) => {
    setIsOtpOpen(false);
    try {
      const response = await fetch("https://app.spiralreports.com/api/auth/verify-otp-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          otp: otp,
          type: "EMAIL",
          context: "TWOFA"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "OTP verification failed");
      }

      const data = await response.json();
      const { access_token, refresh_token, user } = data.data;
      setAuthData({
        ...user, 
        accessToken: access_token,
        refreshToken: refresh_token,
      });

      localStorage.setItem('authData', JSON.stringify({
        ...user,
        accessToken: access_token,
        refreshToken: refresh_token,
      }));

      toast.success("OTP verification successful!", { position: "bottom-right" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      toast.error(error.message, { position: "bottom-right" });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, { position: "bottom-right" });
    }
  }, [error]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-white p-8 relative">
        <Link to="/" className="mb-2"> 
          <img 
            src={log} 
            alt="Logo" 
            className="object-contain w-3/4 h-auto"
            style={{ marginTop: '10%', marginBottom: '10%' }} 
          />
        </Link>
      </div>
      
      <div className="flex items-center justify-center p-20 mt-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {isLoginPage ? (
            <LoginForm 
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleLogin}
              errorMessage={errorMessage}
            />
          ) : (
            <CreateAccountForm />
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link to="/terms" className="underline">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <OTPPopup 
        isOpen={isOtpOpen} 
        onClose={() => setIsOtpOpen(false)} 
        onSubmit={handleOtpSubmit} 
      />

      <ToastContainer />
    </div>
  );
}

export default AuthPage;