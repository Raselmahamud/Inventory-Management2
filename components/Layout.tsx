import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Warehouse, FileBarChart, Settings, 
  Menu, Bell, Moon, Sun, User, LogOut, Search, ChevronRight, Command, Users,
  Truck, Briefcase, CheckCircle, AlertTriangle, Info, X, DollarSign
} from 'lucide-react';
import { ViewState, Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, toggleTheme, isDark }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Stock Alert', message: 'Wireless Headphones below min threshold (20 units).', time: '2m ago', read: false, type: 'warning' },
    { id: '2', title: 'Shipment Arrived', message: 'Inbound #TRK-882910 has been processed at NY Hub.', time: '1h ago', read: false, type: 'success' },
    { id: '3', title: 'New Staff', message: 'Sarah Connor joined Operations department.', time: '3h ago', read: true, type: 'info' },
    { id: '4', title: 'System Update', message: 'Scheduled maintenance tonight at 02:00 AM.', time: '5h ago', read: true, type: 'info' },
  ]);
  
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { id: ViewState.WAREHOUSE, label: 'Warehouses', icon: Warehouse },
    { id: ViewState.SHIPMENTS, label: 'Shipments', icon: Truck },
    { id: ViewState.SUPPLIERS, label: 'Suppliers', icon: Briefcase },
    { id: ViewState.STAFF, label: 'Staff', icon: Users },
    { id: ViewState.PAYROLL, label: 'Payroll', icon: DollarSign },
    { id: ViewState.REPORTS, label: 'Reports', icon: FileBarChart },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Professional Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0F172A] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              N
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">NexStock</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Main Menu</div>
          <nav className="space-y-1">
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
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />}
                  <Icon size={18} className={`mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div 
            onClick={() => onNavigate(ViewState.PROFILE)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-sm font-medium border-2 border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50 transition-all">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john@nexstock.ai</p>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    // Handle logout logic here
                    alert('Logging out...');
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
                <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            {/* Breadcrumbs or Context Title */}
            <div className="hidden md:flex items-center text-sm text-gray-500">
               <span className="hover:text-gray-900 cursor-pointer">App</span>
               <ChevronRight size={14} className="mx-2" />
               <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {activeView === ViewState.PROFILE ? 'Admin Profile' : activeView.toLowerCase()}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <Search size={16} className="absolute left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 w-64 bg-gray-100 dark:bg-gray-800 border-none rounded-md text-sm focus:ring-2 focus:ring-indigo-500/50 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-gray-200"
              />
              <div className="absolute right-2 flex items-center gap-1">
                 <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                   <Command size={10} /> K
                 </kbd>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

             {/* Notification Bell */}
             <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0F172A]"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors relative group ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${
                                notif.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                notif.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                notif.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {notif.type === 'warning' && <AlertTriangle size={14} />}
                                {notif.type === 'success' && <CheckCircle size={14} />}
                                {notif.type === 'error' && <AlertTriangle size={14} />}
                                {notif.type === 'info' && <Info size={14} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {notif.title}
                                  </p>
                                  <p className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              </div>
                              <button 
                                onClick={(e) => removeNotification(notif.id, e)}
                                className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                    <button className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 font-medium">View Activity Log</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
                onClick={() => onNavigate(ViewState.PROFILE)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md relative"
            >
              <User size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-[#0B1120] p-4 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;