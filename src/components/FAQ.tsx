import React, { useState } from "react";
import { FaPlus, FaMinus, FaThLarge } from "react-icons/fa";

const questions = [
  {
    question: "What is HEMIS?",
    answer:
      "HEMIS, or AI-Powered Hospital Executive Management Information System, is a system designed to help hospital executives in making data-driven decisions and managing operations efficiently. It integrates Large Language Models (LLMs) to provide a centralized, real-time dashboard for monitoring hospital performance, finances, human resources, and compliance.",
  },
  {
    question: "How does HEMIS work?",
    answer:
      "HEMIS integrates an LLM which acts as an AI assistant to interpret data, generate summaries, and provide insights. It automates the reporting process for financial, HR, and operational analytics. This allows executives to ask questions in natural language and receive summarized answers directly, simplifying complex data analysis.",
  },
  {
    question: "Who is HEMIS for?",
    answer: "The primary users are hospital executives and administrative staff. The system is designed with a focus on usability, ensuring it is intuitive and easy to use even for non-technical users.",
  },
  {
    question: "What are the main features of HEMIS?",
    answer: "A centralized, interactive dashboard displaying key metrics through graphs, charts, and Automated report generation for financial performance, HR statistics, and operational analytics",
  },
  {
    question: "Who is team behind HEMIS?",
    answer: "HEMIS is developed by a student team from Universitas Islam Indonesia called ZeroKnowledge with distinct roles to cover all project needs",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-6 bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-2 text-gray-800">FAQ</h2>
        <p className="text-center text-gray-400 mb-10">Your questions answered here.</p>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaThLarge className="text-blue-500" />
            <span className="text-blue-500">General Questions</span>
          </div>

          {questions.map((item, index) => (
            <div key={index} className="border-t border-gray-700 pt-5 transition-all">
              <button className="w-full flex justify-between items-center text-left text-lg font-medium focus:outline-none text-blue-500 hover:text-blue-300 transition" onClick={() => toggleQuestion(index)}>
                {item.question}
                {activeIndex === index ? <FaMinus className="text-blue-300" /> : <FaPlus className="text-blue-300" />}
              </button>
              {activeIndex === index && <p className="mt-3 text-gray-500">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
