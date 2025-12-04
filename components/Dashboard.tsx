import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SaleData, CategoryData, Product } from '../types';
import { TrendingUp, AlertTriangle, Package, DollarSign, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  salesData: SaleData[];
  categoryData: CategoryData[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, categoryData, products }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  const cardStyle = "relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time insights into your inventory performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className={`${cardStyle} group`}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                <DollarSign size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Revenue</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$24,500</h3>
            <div className="flex items-center mt-3 text-sm">
              <span className="flex items-center text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                <TrendingUp size={14} className="mr-1" /> +12%
              </span>
              <span className="text-slate-400 ml-2">vs last week</span>
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className={`${cardStyle} group`}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package size={80} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Package size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Stock</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{totalStock}</h3>
            <div className="flex items-center mt-3 text-sm">
              <span className="flex items-center text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} className="mr-1" /> Active
              </span>
              <span className="text-slate-400 ml-2">Across 3 hubs</span>
            </div>
          </div>
        </div>

        {/* Value */}
        <div className={`${cardStyle} group`}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <DollarSign size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Inventory Value</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">${(totalValue / 1000).toFixed(1)}k</h3>
            <div className="flex items-center mt-3 text-sm">
              <span className="text-slate-400">Current assets value</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className={`${cardStyle} group border-red-100 dark:border-red-900/30`}>
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle size={80} className="text-red-600 dark:text-red-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Low Stock</p>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{lowStockCount}</h3>
            <div className="flex items-center mt-3 text-sm">
              <span className="flex items-center text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                Action needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sales Analytics</h3>
            <select className="bg-slate-50 dark:bg-slate-700 border-none text-sm rounded-lg px-3 py-1 text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-8 text-slate-800 dark:text-white">Stock Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '24px' }} iconType="circle" />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] text-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800 dark:text-white">100%</span>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;