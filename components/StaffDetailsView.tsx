import React, { useState } from 'react';
import { Staff } from '../types';
import { 
  ArrowLeft, Mail, Phone, Calendar, User, Clock, 
  DollarSign, Briefcase, FileText, CheckCircle, AlertCircle, PieChart 
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StaffDetailsViewProps {
  staff: Staff;
  onBack: () => void;
}

const StaffDetailsView: React.FC<StaffDetailsViewProps> = ({ staff, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'salary' | 'leaves' | 'schedule'>('overview');

  const LeavePieData = [
    { name: 'Used', value: 24 - (staff.leaveBalance.sick + staff.leaveBalance.casual + staff.leaveBalance.paid), color: '#cbd5e1' },
    { name: 'Remaining', value: staff.leaveBalance.sick + staff.leaveBalance.casual + staff.leaveBalance.paid, color: '#6366f1' },
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <User size={18} className="text-indigo-600"/> Personal Information
        </h3>
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Full Name</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{staff.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Email</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{staff.email}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Phone</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{staff.phone}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Address</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">123 Logistics Way, Suite 400, New York, NY</span>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-600"/> Employment Details
        </h3>
        <div className="space-y-3">
             <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Department</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{staff.department}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Role</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{staff.role}</span>
            </div>
             <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Join Date</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">{new Date(staff.joinDate).toLocaleDateString()}</span>
            </div>
             <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-gray-500">Manager</span>
                <span className="col-span-2 font-medium text-gray-900 dark:text-white">Sarah Connor</span>
            </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
         <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Performance Snapshot</h3>
         <div className="flex items-center gap-8">
            <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{staff.performanceRating}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
            </div>
            <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{staff.attendance}%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Attendance</div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"Consistently exceeds expectations in warehouse logistics efficiency. A valuable team asset."</p>
                <p className="text-xs text-gray-400 mt-2 text-right">- Annual Review 2024</p>
            </div>
         </div>
      </div>
    </div>
  );

  const renderSalary = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
                <p className="text-indigo-100 text-sm font-medium mb-1">Annual CTC</p>
                <h3 className="text-3xl font-bold">${staff.salary.toLocaleString()}</h3>
                <p className="text-xs text-indigo-200 mt-2">Gross Salary per annum</p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <p className="text-gray-500 text-sm font-medium mb-1">Monthly Net</p>
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${Math.round(staff.salary / 12 * 0.82).toLocaleString()}</h3>
                 <p className="text-xs text-gray-400 mt-2">Estimated after taxes (approx)</p>
            </div>
            <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                 <p className="text-gray-500 text-sm font-medium mb-1">Last Bonus</p>
                 <h3 className="text-2xl font-bold text-emerald-600">$1,250</h3>
                 <p className="text-xs text-gray-400 mt-2">Paid Dec 2024</p>
            </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-semibold text-gray-900 dark:text-white">Payment History</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Month</th>
                        <th className="px-6 py-3">Payment Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Slip</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[1,2,3].map((i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">October 2024</td>
                            <td className="px-6 py-3 text-sm text-gray-500">Oct 31, 2024</td>
                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-white font-mono">${Math.round(staff.salary/12).toLocaleString()}</td>
                            <td className="px-6 py-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle size={10} /> Paid
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderLeaves = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                    <span className="block text-sm text-orange-600 dark:text-orange-400 font-semibold mb-1">Casual Leave</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{staff.leaveBalance.casual}</span>
                    <span className="text-xs text-gray-500 block">Available</span>
                </div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <span className="block text-sm text-blue-600 dark:text-blue-400 font-semibold mb-1">Sick Leave</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{staff.leaveBalance.sick}</span>
                    <span className="text-xs text-gray-500 block">Available</span>
                </div>
                 <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <span className="block text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">Paid Leave</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{staff.leaveBalance.paid}</span>
                    <span className="text-xs text-gray-500 block">Available</span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Leave History</h3>
                <div className="space-y-4">
                    {[1,2].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-500">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sick Leave</p>
                                    <p className="text-xs text-gray-500">Aug 12 - Aug 14, 2024</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold">Approved</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Leave Utilization</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                        <Pie data={LeavePieData} innerRadius={40} outerRadius={60} dataKey="value">
                            {LeavePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </RechartsPie>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
                <span className="font-bold text-indigo-600">{staff.leaveBalance.sick + staff.leaveBalance.casual + staff.leaveBalance.paid}</span> days remaining
            </p>
        </div>
    </div>
  );

  const renderSchedule = () => (
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="font-semibold text-gray-900 dark:text-white">Working Schedule</h3>
                 <p className="text-sm text-gray-500">Standard Shift: <span className="font-medium text-gray-900 dark:text-white">{staff.shift}</span></p>
              </div>
              <button className="text-indigo-600 text-sm font-medium hover:underline">Request Change</button>
          </div>

          <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const isWeekend = idx >= 5;
                  return (
                    <div key={day} className={`p-4 rounded-lg border text-center ${isWeekend ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60' : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/50'}`}>
                        <span className="block text-xs font-bold text-gray-500 mb-1">{day}</span>
                        <span className={`block text-sm font-medium ${isWeekend ? 'text-gray-400' : 'text-indigo-700 dark:text-indigo-300'}`}>
                            {isWeekend ? 'Off' : staff.shift.split(' - ')[0]}
                        </span>
                         {!isWeekend && <span className="block text-xs text-gray-400 mt-1">to {staff.shift.split(' - ')[1]}</span>}
                    </div>
                  )
              })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
             <h4 className="font-medium text-gray-900 dark:text-white mb-3">Attendance Stats</h4>
             <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${staff.attendance}%` }}></div>
             </div>
             <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Present: {staff.attendance}%</span>
                <span>Late/Absent: {100 - staff.attendance}%</span>
             </div>
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Staff List
      </button>

      {/* Header Profile Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-md border-4 border-white dark:border-gray-800">
            {staff.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{staff.name}</h2>
            <p className="text-gray-500 font-medium">{staff.role} • {staff.department}</p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                    staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                }`}>
                    {staff.status}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Clock size={14}/> Joined {new Date(staff.joinDate).getFullYear()}</span>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Edit Profile</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">View Reports</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 flex gap-6">
         {[
             { id: 'overview', label: 'Overview', icon: User },
             { id: 'salary', label: 'Salary Details', icon: DollarSign },
             { id: 'leaves', label: 'Leaves', icon: FileText },
             { id: 'schedule', label: 'Working Time', icon: Clock }
         ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
             >
                 <tab.icon size={16} />
                 {tab.label}
                 {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"></span>}
             </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
         {activeTab === 'overview' && renderOverview()}
         {activeTab === 'salary' && renderSalary()}
         {activeTab === 'leaves' && renderLeaves()}
         {activeTab === 'schedule' && renderSchedule()}
      </div>
    </div>
  );
};

export default StaffDetailsView;