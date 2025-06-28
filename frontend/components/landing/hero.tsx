"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
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
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Explore Now
            </button>
          </Link>
          <a href="#more-info">
            <button className="text-blue-500 font-medium px-4 py-2 hover:text-blue-300 transition">
              More Information
            </button>
          </a>
        </div>
      </div>

      {/* Right: Chart */}
      <div className="mt-10 md:mt-0 md:ml-10 w-full max-w-lg flex justify-center">
        <Image 
          src="/assets/Charts-bro.svg" 
          alt="Chart Illustration" 
          width={500}
          height={400}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
};

export default Hero;
