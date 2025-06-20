import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MoreInfo from "./components/MoreInfo";
import AboutUs from "./components/AboutUs";
import GetInTouch from "./components/GetInTouch";
import FAQ from "./components/FAQ";

function App() {
  return (
    <div className="min-h-screen bg-blue-950 text-white">
      <Navbar />
      <Hero />
      <MoreInfo />
      <AboutUs />
      <GetInTouch />
      <FAQ />
    </div>
  );
}

export default App;
