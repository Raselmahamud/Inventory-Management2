import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Calendar, Users, CheckCircle, Clock, AlertTriangle, 
  Download, Filter, Search, MoreHorizontal, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { PayrollRecord } from '../types';
import { MOCK_PAYROLL_RECORDS } from '../constants';

const PayrollView: React.FC = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(MOCK_PAYROLL_RECORDS);
  const [selectedMonth, setSelectedMonth] = useState('October 2024');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter records
  const filteredRecords = useMemo(() => {
    return payrollRecords.filter(record => 
      record.month === selectedMonth &&
      (record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       record.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [payrollRecords, selectedMonth, searchTerm]);

  // Calculate Metrics for selected month
  const totalPayroll = filteredRecords.reduce((acc, curr) => acc + curr.netPay, 0);
  const pendingAmount = filteredRecords.filter(r => r.status === 'Pending').reduce((acc, curr) => acc + curr.netPay, 0);
  const paidCount = filteredRecords.filter(r => r.status === 'Paid').length;
  const pendingCount = filteredRecords.filter(r => r.status === 'Pending').length;

  // Mock Trend Data
  const trendData = [
    { month: 'May', amount: 21000 },
    { month: 'Jun', amount: 22500 },
    { month: 'Jul', amount: 21800 },
    { month: 'Aug', amount: 23200 },
    { month: 'Sep', amount: 22000 },
    { month: 'Oct', amount: totalPayroll }, // Current
  ];

  const handleStatusChange = (id: string, newStatus: PayrollRecord['status']) => {
    setPayrollRecords(prev => prev.map(record => {
      if (record.id === id) {
        return { 
          ...record, 
          status: newStatus,
          paymentDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return record;
    }));
  };

  const handleProcessPayment = (id: string) => {
      if (confirm('Process payment for this employee?')) {
          handleStatusChange(id, 'Paid');
      }
  };

  const StatCard = ({ title, value, subValue, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
            {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Management</h2>
           <p className="text-sm text-gray-500 mt-1">Manage employee salaries, bonuses, and payment processing.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option>October 2024</option>
                    <option>September 2024</option>
                    <option>August 2024</option>
                </select>
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button 
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                onClick={() => alert('Exporting payroll data...')}
            >
                <Download size={16} /> Export Report
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="lg:col-span-2 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard 
                    title="Total Payroll" 
                    value={`$${totalPayroll.toLocaleString()}`} 
                    subValue={`${filteredRecords.length} Employees`}
                    icon={DollarSign} 
                    colorClass="bg-indigo-500 text-indigo-600" 
                  />
                  <StatCard 
                    title="Pending Payment" 
                    value={`$${pendingAmount.toLocaleString()}`} 
                    subValue={`${pendingCount} Pending`}
                    icon={Clock} 
                    colorClass="bg-amber-500 text-amber-600" 
                  />
                  <StatCard 
                    title="Processed" 
                    value={`${paidCount}`} 
                    subValue="Paid this month"
                    icon={CheckCircle} 
                    colorClass="bg-green-500 text-green-600" 
                  />
              </div>

              {/* Main Payroll Table */}
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="relative w-full sm:w-64">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                      </div>
                      <div className="flex gap-2">
                          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <Filter size={18} />
                          </button>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              <tr>
                                  <th className="px-6 py-4">Employee</th>
                                  <th className="px-6 py-4 text-right">Base Salary</th>
                                  <th className="px-6 py-4 text-right">Bonus</th>
                                  <th className="px-6 py-4 text-right">Deductions</th>
                                  <th className="px-6 py-4 text-right">Net Pay</th>
                                  <th className="px-6 py-4 text-center">Status</th>
                                  <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                              {filteredRecords.length === 0 ? (
                                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No records found for this period.</td></tr>
                              ) : (
                                  filteredRecords.map(record => (
                                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                          <td className="px-6 py-4">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                      {record.staffName.charAt(0)}
                                                  </div>
                                                  <div>
                                                      <p className="text-sm font-medium text-gray-900 dark:text-white">{record.staffName}</p>
                                                      <p className="text-xs text-gray-500">{record.role}</p>
                                                  </div>
                                              </div>
                                          </td>
                                          <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-300">
                                              ${record.baseSalary.toLocaleString()}
                                          </td>
                                          <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">
                                              +${record.bonus}
                                          </td>
                                          <td className="px-6 py-4 text-right text-sm text-red-500 font-medium">
                                              -${record.deductions}
                                          </td>
                                          <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                                              ${record.netPay.toLocaleString()}
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                  record.status === 'Paid' 
                                                  ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                                              }`}>
                                                  {record.status}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right">
                                              {record.status === 'Pending' ? (
                                                  <button 
                                                      onClick={() => handleProcessPayment(record.id)}
                                                      className="text-indigo-600 hover:text-indigo-700 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
                                                  >
                                                      Pay Now
                                                  </button>
                                              ) : (
                                                  <div className="flex items-center justify-end gap-2">
                                                      <span className="text-xs text-gray-400">{record.paymentDate}</span>
                                                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                          <Download size={16} />
                                                      </button>
                                                  </div>
                                              )}
                                          </td>
                                      </tr>
                                  ))
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* Right Sidebar: Analytics */}
          <div className="space-y-6">
              <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-indigo-500" /> Payroll Trend
                  </h3>
                  <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 11}} />
                              <Tooltip 
                                  cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                              />
                              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-gray-500">vs Last Month</span>
                      <span className="text-red-500 font-medium flex items-center">
                          <ArrowUpRight size={14} className="mr-1" /> 4.2% Increase
                      </span>
                  </div>
              </div>

              <div className="bg-indigo-600 rounded-xl p-6 text-white shadow-lg">
                  <h4 className="font-bold text-lg mb-2">Next Pay Run</h4>
                  <p className="text-indigo-100 text-sm mb-6">Auto-scheduled for Nov 30, 2024</p>
                  
                  <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm text-indigo-100">
                          <span>Est. Amount</span>
                          <span className="font-bold text-white">$22,450</span>
                      </div>
                      <div className="flex justify-between text-sm text-indigo-100">
                          <span>Employees</span>
                          <span className="font-bold text-white">12</span>
                      </div>
                  </div>

                  <button className="w-full py-2.5 bg-white text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                      Configure Schedule
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default PayrollView;