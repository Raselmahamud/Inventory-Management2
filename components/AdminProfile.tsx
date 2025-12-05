import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, Lock, Clock, Shield, 
  Monitor, Smartphone, History, Edit3, Save, Upload, Activity 
} from 'lucide-react';

const AdminProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'activity'>('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Profile State
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@nexstock.ai',
    phone: '+1 (555) 010-1234',
    role: 'Administrator',
    department: 'Operations',
    location: 'New York, USA',
    bio: 'Senior operations manager with 10+ years of experience in supply chain logistics and inventory optimization.'
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Mock Data
  const recentLogins = [
    { device: 'MacBook Pro', browser: 'Chrome', location: 'New York, USA', time: 'Active now', icon: Monitor, current: true },
    { device: 'iPhone 13', browser: 'Safari', location: 'New York, USA', time: '2 hours ago', icon: Smartphone, current: false },
    { device: 'Windows PC', browser: 'Firefox', location: 'Boston, USA', time: '3 days ago', icon: Monitor, current: false },
  ];

  const activityLog = [
    { action: 'Updated Stock Level', detail: 'Wireless Headphones (WH-001) +50 units', time: '2 hours ago', type: 'inventory' },
    { action: 'Created Shipment', detail: 'Inbound #TRK-882910 from Shenzhen', time: '5 hours ago', type: 'shipment' },
    { action: 'Modified Supplier', detail: 'Updated contact info for TechSply Global', time: '1 day ago', type: 'supplier' },
    { action: 'System Settings', detail: 'Enabled 2FA authentication', time: '2 days ago', type: 'security' },
    { action: 'Exported Report', detail: 'Monthly Sales Report - Oct 2024', time: '3 days ago', type: 'report' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Simulate API call
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
        alert("New passwords don't match!");
        return;
    }
    alert('Password changed successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1E293B] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-gray-400">JD</span>
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md border-2 border-white dark:border-[#1E293B] transition-colors"
                    >
                        <Camera size={14} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <div className="flex gap-3 mb-1">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSaveProfile} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</h1>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    {formData.role} • {formData.department}
                </p>
                <div className="flex gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><MapPin size={16}/> {formData.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16}/> Joined March 2022</span>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 gap-6 px-1">
        {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'security', label: 'Login & Security', icon: Shield },
            { id: 'activity', label: 'Activity Log', icon: Activity },
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></span>}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[400px]">
        
        {/* PERSONAL INFO TAB */}
        {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                        <Edit3 size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Details'}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                        <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="email" 
                                disabled={!isEditing}
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="tel" 
                                disabled={!isEditing}
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio / About</label>
                        <textarea 
                            rows={4}
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:bg-gray-50 disabled:text-gray-500 dark:disabled:bg-gray-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>
            </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Change Password */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="password" required
                                    value={passwordData.current}
                                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="password" required
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="password" required
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login History</h3>
                    <div className="space-y-4">
                        {recentLogins.map((login, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-500">
                                        <login.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{login.device} <span className="text-gray-400 mx-1">•</span> {login.location}</p>
                                        <p className="text-xs text-gray-500">{login.browser} • {login.time}</p>
                                    </div>
                                </div>
                                {login.current ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold">
                                        Active Now
                                    </span>
                                ) : (
                                    <button className="text-gray-400 hover:text-red-500 text-sm font-medium">Log out</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* ACTIVITY LOG TAB */}
        {activeTab === 'activity' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Actions</h3>
                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
                    {activityLog.map((log, idx) => (
                        <div key={idx} className="relative">
                            <div className={`absolute -left-[29px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-[#1E293B] flex items-center justify-center ${
                                log.type === 'security' ? 'bg-red-500' : 
                                log.type === 'shipment' ? 'bg-blue-500' :
                                log.type === 'supplier' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{log.action}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{log.detail}</p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <History size={12} /> {log.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-3 text-center text-sm text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    View Full History
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminProfile;