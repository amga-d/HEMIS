"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const [showSignInAlert, setShowSignInAlert] = useState(false);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignInAlert(true);
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-50 to-yellow-50 p-8">
      {/* Left: Text */}
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Powerful Data <br /> Insights for All
          <br /> Hospital
        </h1>
        <p className="text-gray-500 mt-9">
          An Integrated Data Insight Platform for Hospitals. Enabling you to deeply analyze information, optimize operations, and make accurate strategic decisions with precise and easily understandable data.
        </p>
        <div className="flex gap-4 mt-9">
          <button onClick={handleExploreClick} className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Explore Now
          </button>
          <a href="#more-info">
            <button className="text-blue-500 font-medium px-4 py-2 hover:text-blue-300 transition">More Information</button>
          </a>
        </div>
      </div>

      {/* Sign In Alert Popup */}
      {showSignInAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg ">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication Required</h3>
            <p className="text-gray-500 mb-6">You must sign in first to explore the dashboard.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowSignInAlert(false)} className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right: Chart */}
      <div className="mt-10 md:mt-0 md:ml-10 w-full max-w-lg flex justify-center">
        <Image src="/assets/Charts-bro.svg" alt="Chart Illustration" width={500} height={400} className="w-full h-auto" />
      </div>
    </section>
  );
};

export default Hero;
