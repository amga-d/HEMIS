import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const GetInTouch = () => {
  return (
    <section id="get-in-touch" className="py-20 px-6 bg-gradient-to-br from-yellow-50 via-purple-100 to-blue-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Kiri: Teks dan kontak */}
        <div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mb-6">
            Have a question or need <strong> a free estimate? </strong>, Our team is ready to assist you. Reach out to us through the channels below, and we'll get back to you as soon as possible.
          </p>

          <div className="space-y-5 text-gray-700">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-blue-600" />
              <span>470–601–1911</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <span>HEMISIndoneisa@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              <span>Treasury Tower, Jendral Sudirman St SCBD, South Jakarta, Indonesia</span>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-blue-600" />
              <span>Monday – Friday: 9:00 am – 5:00 pm</span>
            </div>
          </div>
        </div>

        {/* Kanan: Gambar */}
        <div className="flex justify-center">
          <img src="/src/assets/Contact us-amico.svg" alt="Contact Illustration" className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
