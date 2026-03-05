import React from "react";
import { useNavigate } from "react-router-dom";
import { TbArrowUpRight, TbLayoutGrid } from "react-icons/tb";

const Home = () => {
  const navigate = useNavigate();

  const cardsData = [
    { id: 1, title: "Total Students", value: "1,250", path: "/students" },
    { id: 2, title: "Active Lessons", value: "48", path: "/lessons" },
    { id: 3, title: "Average Score", value: "85%", path: "/analytics" },
    { id: 4, title: "Quick Settings", value: "0", path: "/settings" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between mb-6">
            <h3 className="text-slate-400 font-bold text-xs uppercase">
              {card.title}
            </h3>

            <div className="p-2 rounded-xl bg-[#7D0A0A]/5 text-[#7D0A0A]">
              <TbLayoutGrid size={20} />
            </div>
          </div>

          <span className="text-4xl font-black text-slate-900">
            {card.value}
          </span>

          <button
            onClick={() => navigate(card.path)}
            className="mt-6 text-sm font-bold text-[#7D0A0A] flex items-center gap-1"
          >
            Details
            <TbArrowUpRight />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home