import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Warehouse, FileBarChart, Settings, 
  Menu, Bell, Moon, Sun, User, LogOut, Search
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
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
             <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">NexStock</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
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
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon size={20} className={`mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-600 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
              JD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Warehouse Mgr</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Global search..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-1"></div>
            <button className="p-1 rounded-full border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-600">
               <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
                 <User size={16} className="text-gray-500 dark:text-gray-300" />
               </div>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;