import LandingNavbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import MoreInfo from "@/components/landing/more-info";
import AboutUs from "@/components/landing/about-us";
import GetInTouch from "@/components/landing/get-in-touch";
import FAQ from "@/components/landing/faq";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-blue-950 text-white">
      <LandingNavbar />
      <Hero />
      <MoreInfo />
      <AboutUs />
      <GetInTouch />
      <FAQ />
    </div>
  );
}
