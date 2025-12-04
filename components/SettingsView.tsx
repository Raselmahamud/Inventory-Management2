import React, { useState } from 'react';
import { 
  User, Bell, Lock, Globe, Moon, Sun, Shield, 
  Zap, CreditCard, Mail, Smartphone, Check, ChevronRight
} from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDark, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true
  });

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md border border-gray-100 dark:border-gray-700 hover:bg-gray-50">
                   <User size={14} className="text-gray-600 dark:text-gray-300"/>
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">John Doe</h3>
                <p className="text-gray-500 text-sm">Inventory Manager • New York Branch</p>
                <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700">Change Avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" defaultValue="john@nexstock.ai" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 000-1234" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                <input type="text" defaultValue="Administrator" disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interface Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => isDark && toggleTheme()}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${!isDark ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                  >
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex flex-col overflow-hidden shadow-sm">
                       <div className="h-4 bg-white border-b border-gray-200"></div>
                       <div className="flex-1 bg-gray-50 p-2 space-y-2">
                          <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <Sun size={18} /> Light Mode
                    </div>
                  </div>

                  <div 
                    onClick={() => !isDark && toggleTheme()}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${isDark ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                  >
                    <div className="w-full h-24 bg-gray-900 rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-sm">
                       <div className="h-4 bg-gray-800 border-b border-gray-700"></div>
                       <div className="flex-1 bg-gray-900 p-2 space-y-2">
                          <div className="h-2 w-3/4 bg-gray-700 rounded"></div>
                          <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                      <Moon size={18} /> Dark Mode
                    </div>
                  </div>
                </div>
             </div>

             <div>
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Density</h3>
               <div className="flex items-center gap-4">
                  <button className="px-4 py-2 rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-700 text-sm font-medium">Comfortable</button>
                  <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">Compact</button>
               </div>
             </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
               <Bell className="text-blue-600 shrink-0 mt-0.5" size={20} />
               <div>
                 <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200">System Wide Alerts</h4>
                 <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">These settings apply to your daily inventory digests and critical stock warnings.</p>
               </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                         <Mail size={20} />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                         <p className="text-xs text-gray-500">Receive daily summaries and invoices.</p>
                      </div>
                   </div>
                   <Toggle checked={notifications.email} onChange={() => setNotifications(prev => ({...prev, email: !prev.email}))} />
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                         <Smartphone size={20} />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                         <p className="text-xs text-gray-500">Real-time alerts for low stock.</p>
                      </div>
                   </div>
                   <Toggle checked={notifications.push} onChange={() => setNotifications(prev => ({...prev, push: !prev.push}))} />
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                         <Zap size={20} />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900 dark:text-white">AI Insights Report</p>
                         <p className="text-xs text-gray-500">Weekly trend analysis via Gemini AI.</p>
                      </div>
                   </div>
                   <Toggle checked={notifications.weeklyReport} onChange={() => setNotifications(prev => ({...prev, weeklyReport: !prev.weeklyReport}))} />
                </div>
             </div>
          </div>
        );
      
      case 'integrations':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                         <Zap size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 dark:text-white text-lg">Google Gemini AI</h3>
                         <p className="text-sm text-gray-500">Forecasting & Natural Language Search</p>
                      </div>
                   </div>
                   <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                      <Check size={12} /> Connected
                   </span>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">API Key</label>
                   <div className="flex gap-2">
                      <input 
                        type="password" 
                        value="sk-................................" 
                        disabled 
                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm text-gray-500"
                      />
                      <button className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium hover:bg-gray-50">Edit</button>
                   </div>
                </div>
                
                <div className="flex justify-end">
                   <button className="text-sm text-red-600 hover:text-red-700 font-medium">Disconnect Integration</button>
                </div>
             </div>

             <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm opacity-60">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                         <CreditCard size={24} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 dark:text-white text-lg">QuickBooks / Xero</h3>
                         <p className="text-sm text-gray-500">Accounting Synchronization</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Connect</button>
                </div>
             </div>
          </div>
        );

      default:
        return <div className="text-gray-500">Select a category</div>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account preferences and workspace settings.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
             {tabs.map((tab) => {
               const Icon = tab.icon;
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                     isActive 
                     ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200 dark:border-gray-700' 
                     : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                   }`}
                 >
                   <div className="flex items-center gap-3">
                     <Icon size={18} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} />
                     {tab.label}
                   </div>
                   {isActive && <ChevronRight size={16} />}
                 </button>
               )
             })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[500px] bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
           {renderContent()}
           
           <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition-all transform active:scale-95">
                Save Changes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;