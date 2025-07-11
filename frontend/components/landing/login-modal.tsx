"use client"

import React, { useState, useEffect } from "react";
import { MdOutlineLocalHospital } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { clearAuthCache } from '@/lib/auth'

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  username?: string;
  password?: string;
  general?: string;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, isLoading]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear errors when user types
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  const handleLogin = async () => {
    // Clear general error
    setErrors(prev => ({ ...prev, general: undefined }));

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password 
        })
      });

      if (!res.ok) {
        const err = await res.json();
        
        // Handle specific error cases
        if (res.status === 401) {
          setErrors({ general: "Invalid username or password" });
        } else if (res.status === 400) {
          setErrors({ general: err.error || "Invalid input data" });
        } else if (res.status === 429) {
          setErrors({ general: "Too many login attempts. Please try again later." });
        } else if (res.status >= 500) {
          setErrors({ general: "Server error. Please try again later." });
        } else {
          setErrors({ general: err.error || "Login failed. Please try again." });
        }
        return;
      }

      // Clear auth cache to ensure fresh authentication check
      clearAuthCache();
      
      // Reset form
      setUsername("");
      setPassword("");
      setErrors({});
      
      // Login successful - close modal and redirect
      onClose();
      router.push("/dashboard");
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ 
        general: "Network error. Please check your connection and try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setUsername("");
    setPassword("");
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] md:w-[800px] rounded-xl shadow-xl flex overflow-hidden relative">
        {/* Close button for mobile */}
        <button 
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 md:hidden" 
          onClick={handleClose}
        >
          <AiOutlineClose size={24} />
        </button>
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdOutlineLocalHospital size={24} color="#60a5fa" />
            <span className="font-bold text-sm text-blue-500">HEMIS</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Holla, Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">Hey, welcome back to your special place</p>

          {/* General Error Display */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          {/* Username Input */}
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Username" 
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 ${
                errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              value={username} 
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 pr-10 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={password} 
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span></span>
            <button 
              type="button"
              className="hover:underline disabled:opacity-50"
              disabled={isLoading}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            className="bg-blue-500 text-white font-medium px-4 py-2 mt-9 rounded-md hover:bg-blue-600 transition w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-400 to-pink-400 justify-center items-center relative">
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-200" 
            onClick={handleClose}
          >
            <AiOutlineClose size={24} />
          </button>
          <Image 
            src="/assets/Fingerprint-bro.svg" 
            alt="Login Illustration" 
            width={300}
            height={300}
            className="w-3/4"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
