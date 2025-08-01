"use client"

import React, { useState } from "react";
import { MdOutlineLocalHospital } from "react-icons/md";
import LoginModal from "@/components/landing/login-modal";

const LandingNavbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="absolute top-0 left-0 w-full bg-white/10 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-7 py-4">
          {/* Left: Logo and HEMIS */}
          <div className="flex items-center gap-3">
            <MdOutlineLocalHospital size={38} color="#60a5fa" />
            <span className="text-blue-500 font-bold text-xl">HEMIS</span>
            <a href="#about-us">
              <button className="text-blue-500 font-medium px-5 py-2 hover:text-blue-300 transition ml-2">Who We Are</button>
            </a>
            <a href="#get-in-touch">
              <button className="text-blue-500 font-medium px-5 py-2 hover:text-blue-300 transition ml-2">Get In Touch</button>
            </a>
            <a href="#faq">
              <button className="text-blue-500 font-medium px-5 py-2 hover:text-blue-300 transition ml-2">FAQ</button>
            </a>
          </div>

          {/* Right: Sign In Button */}
          <button 
            onClick={() => setIsLoginOpen(true)} 
            className="text-blue-500 font-medium px-5 py-2 hover:text-blue-300 transition"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default LandingNavbar;
