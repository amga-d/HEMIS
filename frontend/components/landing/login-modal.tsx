"use client"

import React, { useState } from "react";
import { MdOutlineLocalHospital } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

import { clearAuthCache } from '@/lib/auth'

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Login failed");
        return;
      }

      // Clear auth cache to ensure fresh authentication check
      clearAuthCache();
      
      // Login successful - close modal and redirect
      onClose();
      router.push("/dashboard");
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] md:w-[800px] rounded-xl shadow-xl flex overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdOutlineLocalHospital size={24} color="#60a5fa" />
            <span className="font-bold text-sm text-blue-500">HEMIS</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Holla, Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">Hey, welcome back to your special place</p>

          <input 
            type="text" 
            placeholder="Username" 
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span></span>
            <button className="hover:underline">Forgot Password?</button>
          </div>

          <button 
            onClick={handleLogin} 
            className="bg-blue-500 text-white font-medium px-4 py-2 mt-9 rounded-md hover:bg-blue-600 transition w-full"
          >
            Sign In
          </button>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-400 to-pink-400 justify-center items-center relative">
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-200" 
            onClick={onClose}
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
