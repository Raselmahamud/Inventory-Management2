import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, ComposedChart, Line, BarChart, Bar
} from 'recharts';
import { SaleData, CategoryData, Product } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Package, AlertCircle, ShoppingCart, Activity } from 'lucide-react';

interface DashboardProps {
  salesData: SaleData[];
  categoryData: CategoryData[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, categoryData, products }) => {
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock < p.minStock).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Process data for Inventory Health (Healthy vs Low Stock per Category)
  const stockHealthData = React.useMemo(() => {
    const health: Record<string, { name: string; Healthy: number; Low: number }> = {};
    products.forEach(p => {
        if (!health[p.category]) health[p.category] = { name: p.category, Healthy: 0, Low: 0 };
        if (p.stock <= p.minStock) health[p.category].Low += 1;
        else health[p.category].Healthy += 1;
    });
    return Object.values(health);
  }, [products]);

  // Process data for Top 5 High Value Assets
  const topAssetsData = React.useMemo(() => {
    return [...products]
        .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
        .slice(0, 5)
        .map(p => ({ 
            name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name, 
            value: p.price * p.stock,
            fullValue: p.price * p.stock
        }));
  }, [products]);

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
          icon={Activity} 
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

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue & Orders Dual Axis Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Performance Analytics</h3>
                <p className="text-xs text-gray-500 mt-1">Revenue vs Order Volume correlation</p>
            </div>
            <div className="flex gap-2">
                {['1W', '1M', '3M'].map((period) => (
                    <button key={period} className={`text-xs font-medium px-2 py-1 rounded ${period === '1M' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                        {period}
                    </button>
                ))}
            </div>
          </div>
          <div className="h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}} 
                    dy={10} 
                />
                <YAxis 
                    yAxisId="left"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748B', fontSize: 12}}
                    tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                    yAxisId="right"
                    orientation="right"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12}} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#10b981" strokeWidth={2} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Assets by Value */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col">
          <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">High Value Assets</h3>
              <p className="text-xs text-gray-500 mt-1">Top 5 products by total inventory value</p>
          </div>
          <div className="flex-1 w-full min-w-0">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAssetsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{fill: '#64748B', fontSize: 11, fontWeight: 500}}
                    />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24}>
                        {topAssetsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'][index % 5]} />
                        ))}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Inventory Health (Stacked Bar) */}
         <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Inventory Health</h3>
                    <p className="text-xs text-gray-500 mt-1">Stock status distribution per category</p>
                </div>
                <div className="flex gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Low Stock
                    </div>
                </div>
            </div>
            <div className="h-[250px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockHealthData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748B', fontSize: 12}} 
                            dy={10} 
                        />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                            contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                        />
                        <Bar dataKey="Healthy" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={40} />
                        <Bar dataKey="Low" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

        {/* Category Distribution (Donut) */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6">Stock Distribution</h3>
          <div className="flex-1 flex items-center justify-center relative min-w-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="block text-3xl font-bold text-gray-900 dark:text-white">{totalStock}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Items</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.slice(0,4).map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{backgroundColor: cat.color}}></div>
                      <span className="text-gray-600 dark:text-gray-300 truncate">{cat.name}</span>
                  </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;