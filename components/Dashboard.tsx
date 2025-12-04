import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SaleData, CategoryData, Product } from '../types';
import { TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react';

interface DashboardProps {
  salesData: SaleData[];
  categoryData: CategoryData[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, categoryData, products }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$24,500</h3>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <TrendingUp size={12} className="mr-1" /> +12% from last week
              </p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-slate-700 rounded-lg text-indigo-600 dark:text-indigo-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Stock</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totalStock} units</h3>
              <p className="text-xs text-gray-400 mt-1">Across 3 warehouses</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Inventory Value</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">${totalValue.toLocaleString()}</h3>
              <p className="text-xs text-gray-400 mt-1">Current assets</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{lowStockCount} Items</h3>
              <p className="text-xs text-red-500 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-slate-700 rounded-lg text-red-600 dark:text-red-400">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Sales Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white">Stock by Category</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">100%</span>
              <p className="text-xs text-gray-500">Distribution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;