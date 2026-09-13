import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Calculator,
  Recycle,
  Flame,
  FileText,
  Database,
  Settings,
  HelpCircle,
  Sun,
  RefreshCw,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  Leaf,
  LogOut,
  Zap
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children, activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user || { name: "Adam Mays", role: "Sustainability Manager" };
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "AI Insights", icon: Sparkles, badge: "NEW", path: "/ai-insights" },
    { name: "ROI & Cost Calculator", icon: Calculator, path: "/roi-calculator" },
    { name: "Waste Reusability", icon: Recycle, path: "/waste-exchange" },
    { name: "Emission Leak Detector", icon: Flame, path: "/leak-detector" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];
  
  const handleMenuClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    navigate("/login");
  };

  let currentActive = activeMenu;
  if (!currentActive) {
      const currentItem = menuItems.find(item => item.path === location.pathname);
      currentActive = currentItem ? currentItem.name : "Dashboard";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen">
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-8 mt-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img src="/logo.jpg" alt="CarbonTrace Logo" className="w-full h-auto rounded-xl shadow-md border border-gray-800" />
            <p className="text-[9px] text-gray-500 uppercase tracking-wider mt-2 px-2 text-center">Decarbonize Today. A Greener Tomorrow.</p>
          </div>

          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentActive === item.name 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={currentActive === item.name ? "text-emerald-600" : "text-gray-400"} />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-4">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                <Leaf size={16} className="text-emerald-600" />
                <span className="text-sm">Net Zero</span>
              </div>
              <p className="text-emerald-900 font-extrabold text-lg leading-tight mb-3">is a Better Business.</p>
              <p className="text-[10px] text-emerald-700 font-medium">Measure • Reduce • Reimagine</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-200/50 rounded-full blur-xl pointer-events-none"></div>
          </div>

          <div className="flex items-center justify-between text-gray-500 px-2 pt-2">
            <button className="flex items-center gap-2 text-xs font-medium hover:text-gray-900 transition-colors">
              <HelpCircle size={14} />
              Help & Support
            </button>
            <div className="flex items-center gap-2">
              <button className="hover:text-gray-900 p-1"><Sun size={14} /></button>
              <button className="hover:text-gray-900 p-1"><RefreshCw size={14} /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search facilities, materials, reports..." 
              className="w-full pl-10 pr-16 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block bg-white border border-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded shadow-sm font-sans">Ctrl</kbd>
              <kbd className="hidden sm:inline-block bg-white border border-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded shadow-sm font-sans">K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4">
            <button className="hidden md:flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
              <Calendar size={16} className="text-gray-500" />
              Jan 2025 - Dec 2025
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            
            <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="hidden sm:flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-1 rounded-lg"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user.name ? user.name.substring(0,2).toUpperCase() : "AM"}
                </div>
                <div className="leading-tight text-left">
                  <p className="text-sm font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role || 'Sustainability Manager'}</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 ml-1" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
