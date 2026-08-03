import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Organisation :</span>
        <span className="bg-slate-800 text-cyan-400 px-2.5 py-1 rounded border border-slate-700 text-xs font-mono font-semibold">
          Tenant Principal (default)
        </span>
      </div>

      {/* Profile & Action */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
          <div className="w-8 h-8 rounded-full bg-[#1b82a4] text-white font-bold flex items-center justify-center text-xs shadow">
            SA
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-200">Super Admin</p>
            <p className="text-[10px] text-slate-400">admin@obsen.internal</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded transition font-medium cursor-pointer"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}