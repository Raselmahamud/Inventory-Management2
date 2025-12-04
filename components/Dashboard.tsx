import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { SaleData, CategoryData, Product } from '../types';
import { TrendingUp, TrendingDown, ArrowRight, DollarSign, Package, AlertCircle } from 'lucide-react';

interface DashboardProps {
  salesData: SaleData[];
  categoryData: CategoryData[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, categoryData, products }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Helper for KPI Cards
  const KpiCard = ({ title, value, trend, trendUp, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`flex items-center font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your inventory performance.</p>
        </div>
        <div className="flex gap-2">
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Warehouses</option>
                <option>New York</option>
                <option>California</option>
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Download Report
            </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value="$24,500" 
          trend="12.5%" 
          trendUp={true} 
          icon={DollarSign} 
          colorClass="bg-indigo-500 text-indigo-600" 
        />
        <KpiCard 
          title="Total Stock" 
          value={totalStock.toLocaleString()} 
          trend="2.1%" 
          trendUp={true} 
          icon={Package} 
          colorClass="bg-blue-500 text-blue-600" 
        />
        <KpiCard 
          title="Inventory Value" 
          value={`$${(totalValue / 1000).toFixed(1)}k`} 
          trend="0.5%" 
          trendUp={false} 
          icon={DollarSign} 
          colorClass="bg-emerald-500 text-emerald-600" 
        />
        <KpiCard 
          title="Low Stock Items" 
          value={lowStockCount} 
          trend="5 Items" 
          trendUp={false} 
          icon={AlertCircle} 
          colorClass="bg-red-500 text-red-600" 
        />
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Revenue Analytics</h3>
            <div className="flex gap-2">
                {['1W', '1M', '3M', '1Y'].map((period) => (
                    <button key={period} className={`text-xs font-medium px-2 py-1 rounded ${period === '1M' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                        {period}
                    </button>
                ))}
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}} 
                    dy={10} 
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">Stock Distribution</h3>
          <div className="flex-1 flex items-center justify-center relative min-w-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">{totalStock}</span>
                    <span className="text-xs text-gray-500">Total Units</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
              {categoryData.slice(0,3).map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: cat.color}}></div>
                          <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{Math.round((cat.value / totalStock) * 100)}%</span>
                  </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;