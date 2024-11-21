import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import default styles
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Separator } from '../ui/Separator';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

// Work roles array (same as before)
const workRoles = [
  { value: '', label: 'Select your work role' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'audit_team_member', label: 'Audit Team Member' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'compliance_analyst', label: 'Compliance Analyst' },
  { value: 'compliance_director', label: 'Compliance Director' },
  { value: 'quality_control_inspector', label: 'Quality Control Inspector' },
  { value: 'quality_manager', label: 'Quality Manager' },
  { value: 'vice_president_compliance', label: 'Vice President Compliance' },
  { value: 'compliance_manager', label: 'Compliance Manager' },
  { value: 'director', label: 'Director' },
  { value: 'management', label: 'Management' },
  { value: 'quality_engineer', label: 'Quality Engineer' },
  { value: 'risk_manager', label: 'Risk Manager' },
  { value: 'student', label: 'Student' },
  { value: 'department_owner', label: 'Department Owner' },
  { value: 'risk_team_member', label: 'Risk Team Member' },
  { value: 'security_operations', label: 'Security Operations' },
  { value: 'other', label: 'Other' },
];

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    company: '',
    industry: '',
    password: '',
    confirmPassword: '',
    workRole: '',
    otherWorkRole: '',
    country: '', // Ensure country is included in state
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10; // Basic validation
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    if (step === 1 && !email) {
      setErrorMessage('Email is required');
      return;
    }
    if (step === 2 && (!formData.firstName || !formData.lastName || !formData.country)) {
      setErrorMessage('First name, last name, and country are required');
      return;
    }
    if (step === 2 && !validatePhoneNumber(formData.phone)) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (step === 4 && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setErrorMessage('');
    setStep(step + 1);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Check that country is filled in
    if (!formData.country) {
      setErrorMessage('Country is required');
      return;
    }

    try {
      const response = await fetch('https://app.spiralreports.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData, // Spread the formData, including the country
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data = await response.json();
      const { access_token, refresh_token, user } = data.data; // Access data inside the response
      console.log(access_token);

      // Store user data and tokens in context (using the login function from useAuth)
      login({ access_token, refresh_token, user });

      // After login, navigate to the assessment page and pass the user data and tokens
      navigate('/dashboard', {
        state: {
          user,            // Pass the user object
          access_token,    // Pass the access token
          refresh_token,   // Pass the refresh token
        },
      });

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
      <p className="text-sm text-muted-foreground">Fill in the details below to sign up</p>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <form onSubmit={step === 4 ? handleSignup : handleNextStep} className="grid gap-6">
        {step === 1 && (
          <div className="grid gap-2">
            <Input id="email" placeholder="Email" value={email} onChange={handleEmailChange} />
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-2">
            <Input id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
            <Input id="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleInputChange} />
            <Input id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
            <div className="flex items-center">
              <PhoneInput
                defaultCountry="US"
                value={formData.phone}
                onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                onCountryChange={(country) => setFormData((prev) => ({ ...prev, country }))}
                className="w-full border rounded p-2"
                placeholder="Phone Number"
                international
              />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-2">
            <Input id="company" placeholder="Company" value={formData.company} onChange={handleInputChange} />
            <Input id="industry" placeholder="Industry" value={formData.industry} onChange={handleInputChange} />
            <select
              id="workRole"
              value={formData.workRole}
              onChange={handleInputChange}
              className="p-2 border rounded"
            >
              {workRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {formData.workRole === 'other' && (
              <Input 
                id="otherWorkRole" 
                placeholder="Please specify your work role" 
                value={formData.otherWorkRole} 
                onChange={handleInputChange} 
              />
            )}
          </div>
        )}
        {step === 4 && (
          <PasswordCheckerWithConfirm 
            password={formData.password} 
            setPassword={(password) => setFormData(prev => ({ ...prev, password }))} 
            confirmPassword={formData.confirmPassword} 
            setConfirmPassword={(confirmPassword) => setFormData(prev => ({ ...prev, confirmPassword }))} 
          />
        )}
        <Button 
          variant="ghost"
          type="submit" 
          style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
        >
          {step === 4 ? 'Sign Up' : 'Next'}
        </Button>
      </form>
      <Separator />
      {step === 1 && (
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2" 
          onClick={() => console.log("Google login clicked")}
        >
          <FaGoogle className="text-lg" />
          Sign in with Google
        </Button>
      )}
    </div>
  );
};

// Password checker component remains unchanged
const PasswordCheckerWithConfirm = ({ password, setPassword, confirmPassword, setConfirmPassword }) => {
  const [isPasswordStrong, setIsPasswordStrong] = useState(false);
  const [validationResults, setValidationResults] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setValidationResults(checks);
    const isStrong = Object.values(checks).every(check => check);
    setIsPasswordStrong(isStrong);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
    if (confirmPassword) {
      setPasswordMatch(confirmPassword === newPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmValue = e.target.value;
    setConfirmPassword(confirmValue);
    setPasswordMatch(confirmValue === password);
  };

  return (
    <div className="max-w-md space-y-4">
      <div className="flex flex-col">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter password"
        />
        <div className="flex flex-col mt-2 text-red-600">
          {!isPasswordStrong && (
            <>
              <div className="flex items-center">
                <span className={validationResults.length ? 'text-green-600' : 'text-red-600'}>✓</span>
                <span className={validationResults.length ? 'text-green-600' : 'text-red-600'}>At least 8 characters</span>
              </div>
              <div className="flex items-center">
                <span className={validationResults.uppercase ? 'text-green-600' : 'text-red-600'}>✓</span>
                <span className={validationResults.uppercase ? 'text-green-600' : 'text-red-600'}>At least one uppercase letter</span>
              </div>
              <div className="flex items-center">
                <span className={validationResults.lowercase ? 'text-green-600' : 'text-red-600'}>✓</span>
                <span className={validationResults.lowercase ? 'text-green-600' : 'text-red-600'}>At least one lowercase letter</span>
              </div>
              <div className="flex items-center">
                <span className={validationResults.digit ? 'text-green-600' : 'text-red-600'}>✓</span>
                <span className={validationResults.digit ? 'text-green-600' : 'text-red-600'}>At least one number</span>
              </div>
              <div className="flex items-center">
                <span className={validationResults.specialChar ? 'text-green-600' : 'text-red-600'}>✓</span>
                <span className={validationResults.specialChar ? 'text-green-600' : 'text-red-600'}>At least one special character</span>
              </div>
            </>
          )}
          {isPasswordStrong && (
            <div className="space-y-2">
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Confirm password"
              />
              {confirmPassword && (
                <p className={`text-sm ${passwordMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {passwordMatch ? 'Passwords match!' : 'Passwords do not match'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAccountForm;
