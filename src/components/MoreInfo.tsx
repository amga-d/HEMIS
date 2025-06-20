import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { FaRegChartBar } from "react-icons/fa";

const cards = [
  {
    title: "Dashboard",
    subtitle: "Monitor key performance indicators (KPIs) like total patients, revenue, and patient inflow in real-time. Get a comprehensive overview of the current status on a single page.", // min 27 words
    icon: <MdOutlineDashboard size={24} className="text-blue-500" />,
  },
  {
    title: "Finance Report",
    subtitle: "Track revenue, manage budget usage, and analyze financial statements. All essential financial data for strategic decision-making is here.",
    icon: <LuChartNoAxesCombined size={24} className="text-blue-500" />,
  },
  {
    title: "HR Report",
    subtitle: "Access human resources reports, from staff data and personnel audits to performance reviews. Ensure team management is efficient and up to standard.",
    icon: <MdOutlinePeopleOutline size={24} className="text-blue-500" />,
  },
  {
    title: "Compliance Tracking",
    subtitle: "Monitor regulatory compliance status, track important audit deadlines, and manage compliance alerts to mitigate violation risks.",
    icon: <FaRegChartBar size={24} className="text-blue-500" />,
  },
];

const MoreInfo = () => {
  return (
    <section id="more-info" className="py-20 px-6 bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-100">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">More Information</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <div key={index} className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-6 shadow-lg text-left transition hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
              {card.icon}
            </div>
            <p className="text-gray-600">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoreInfo;
