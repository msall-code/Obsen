import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Équipements", path: "/equipements", icon: "💻" },
    { label: "Topologie Parc", path: "/topologie", icon: "🌐" },
    { label: "Grafana", path: "/grafana", icon: "📈" },
    { label: "Utilisateurs", path: "/users", icon: "👥" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Logo Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="w-9 h-9 bg-white rounded-lg p-1 flex items-center justify-center shadow">
            <img src="/logo.jpg" alt="Logo" className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-wider">OBSEN</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Supervision & SRE</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1b82a4] text-white shadow-md font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        OBSEN Platform v1.0 © 2026
      </div>
    </aside>
  );
}