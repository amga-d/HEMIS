// components/LoginModal.tsx
import React, { useState } from "react";
import { MdOutlineLocalHospital } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "/dashboard"; // redirect dummy
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] md:w-[800px] rounded-xl shadow-xl flex overflow-hidden">
        {/* Kiri */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center gap-2 mb-6">
            <MdOutlineLocalHospital size={24} color="#60a5fa" />
            <span className="font-bold text-sm text-blue-500">HEMIS</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Holla, Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-6">Hey, welcome back to your special place</p>

          <input type="text" placeholder="Username" className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-500" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
            <span></span>
            <button className="hover:underline">Forgot Password?</button>
          </div>

          <button onClick={handleLogin} className="bg-blue-500 text-white font-medium px-4 py-2 mt-9 rounded-md hover:bg-blue-600 transition">
            Sign In
          </button>
        </div>

        {/* Kanan */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-400 to-pink-400 justify-center items-center relative">
          <button className="absolute top-4 right-4 text-white hover:text-gray-200" onClick={onClose}>
            <AiOutlineClose size={24} />
          </button>
          <img src="/src/assets/Fingerprint-bro.svg" alt="Login Illustration" className="w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
