import React from "react";
import { Outlet } from "react-router-dom";
import { TbMathFunction, TbUserCircle } from "react-icons/tb";

const AdminLayout = () => {
  return (
    <div className="min-h-screen max-w-screen  bg-[#F8FAFC] font-sans  overflow-x-hidden"  >

      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 fixed top-0 w-full z-50 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-[#7D0A0A] p-1.5 rounded-lg">
            <TbMathFunction className="text-white text-xl" />
          </div>

          <span className="text-lg font-bold text-slate-800 tracking-tight">
            Math<span className="text-[#7D0A0A]">Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer group transition-all">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-700 leading-none group-hover:text-[#7D0A0A]">
              Admin User
            </p>
          </div>

          <TbUserCircle className="text-3xl text-slate-400 group-hover:text-[#7D0A0A] transition-colors" />
        </div>
      </nav>

      {/* Pages */}
<main className="pt-20  mx-auto">
          <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;