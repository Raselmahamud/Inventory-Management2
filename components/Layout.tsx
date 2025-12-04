import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Warehouse, FileBarChart, Settings, 
  Menu, Bell, Moon, Sun, User, LogOut, Search, X
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, toggleTheme, isDark }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { id: ViewState.WAREHOUSE, label: 'Warehouses', icon: Warehouse },
    { id: ViewState.REPORTS, label: 'Reports', icon: FileBarChart },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F4F6] dark:bg-[#0f172a] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Floating Style */}
      <aside className={`fixed inset-y-4 left-4 z-50 w-72 bg-slate-900 dark:bg-slate-800 text-white rounded-3xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-2rem)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>
        
        {/* Brand */}
        <div className="h-24 flex items-center px-8 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
             <span className="text-white font-bold text-xl">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NexStock</h1>
            <p className="text-xs text-slate-400 font-medium">AI Inventory</p>
          </div>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-5 py-4 text-sm font-medium rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50 text-white' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={22} className={`mr-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto">
          <div className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-md">
              JD
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">John Doe</p>
              <p className="text-xs text-slate-400 truncate">Manager</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Floating Header */}
        <header className="px-4 lg:px-8 pt-4 pb-2">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-slate-700 h-20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <div className="hidden md:flex relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Type to search..." 
                  className="w-80 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;