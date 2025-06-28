"use client"

import React from "react";
import Image from "next/image";

const AboutUs = () => {
  return (
    <section id="about-us" className="py-20 px-6 bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <div>
          <p className="text-blue-500 font-semibold mb-2">About Us</p>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Our Dream is <br /> Develop an LLM-powered <br /> MIS dashboard
          </h2>
          <p className="text-gray-500 leading-relaxed">
            The HEMIS (Hospital Executive Management Information System) dashboard represents a clear and effective user interface designed for hospital executives and administrative staff. The interface is optimized for quick
            decision-making, real-time monitoring, and regulatory compliance. The HEMIS platform integrates a Large Language Model (LLM) to enhance decision making and operational efficiency for hospital executives. The LLM serves as an AI
            assistant capable of interpreting hospital data, generating summaries, providing actionable insights, and answering strategic questions using natural language.
          </p>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center">
          <Image 
            src="/assets/Design team-bro.svg" 
            alt="Team Illustration" 
            width={400}
            height={400}
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-14 text-center">
        <div className="bg-blue-400 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-white">3.5</h3>
          <p className="text-sm text-white">Years Experience</p>
        </div>
        <div className="bg-blue-400 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-white">23</h3>
          <p className="text-sm text-white">Project Challenge</p>
        </div>
        <div className="bg-blue-400 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-white">830+</h3>
          <p className="text-sm text-white">Positive Reviews</p>
        </div>
        <div className="bg-blue-400 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-white">1K</h3>
          <p className="text-sm text-white">Trusted Hospital</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
