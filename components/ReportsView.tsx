import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart
} from 'recharts';
import { SaleData, CategoryData, Product } from '../types';
import { 
  Download, Calendar, FileText, TrendingUp, DollarSign, 
  ShoppingBag, Filter, Printer, Share2, ArrowUpRight, ArrowDownRight,
  Package, Layers, AlertCircle
} from 'lucide-react';

interface ReportsViewProps {
  salesData: SaleData[];
  categoryData: CategoryData[];
  products: Product[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ salesData, categoryData, products }) => {
  const [reportType, setReportType] = useState<'sales' | 'inventory'>('sales');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Sales Calculations
  const totalRevenue = salesData.reduce((acc, cur) => acc + cur.revenue, 0);
  const totalOrders = salesData.reduce((acc, cur) => acc + cur.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const grossProfit = totalRevenue * 0.42; // Mock 42% margin

  // Inventory Calculations
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  // Mock Data for Advanced Charts
  const profitData = salesData.map(d => ({
    ...d,
    profit: d.revenue * 0.4,
    expenses: d.revenue * 0.6
  }));

  const stockValueByCategory = categoryData.map(c => {
    const catProducts = products.filter(p => p.category === c.name);
    const value = catProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
    return { name: c.name, value: value };
  });

  const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-opacity-10 ${color.bg}`}>
                <Icon size={20} className={color.text} />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {Math.abs(trend)}%
            </span>
            <span className="text-gray-400 ml-2">{subValue}</span>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       {/* Header Controls */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Deep dive into financial performance and operational metrics.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
             <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button 
                  onClick={() => setReportType('sales')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${reportType === 'sales' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  Sales & Finance
                </button>
                <button 
                  onClick={() => setReportType('inventory')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${reportType === 'inventory' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'}`}
                >
                  Inventory Health
                </button>
             </div>
             
             <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
             
             <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Calendar size={16} /> {dateRange}
             </button>
             <button 
                onClick={() => alert('Downloading Report...')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
             >
                <Download size={16} /> Export
             </button>
          </div>
       </div>

       {/* SALES REPORT VIEW */}
       {reportType === 'sales' && (
          <div className="space-y-6">
             {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Gross Revenue" 
                    value={`$${totalRevenue.toLocaleString()}`} 
                    subValue="vs last period" 
                    trend={12.5} 
                    icon={DollarSign} 
                    color={{bg: 'bg-indigo-500', text: 'text-indigo-600'}} 
                 />
                 <StatCard 
                    title="Net Profit" 
                    value={`$${grossProfit.toLocaleString()}`} 
                    subValue="vs last period" 
                    trend={8.2} 
                    icon={TrendingUp} 
                    color={{bg: 'bg-emerald-500', text: 'text-emerald-600'}} 
                 />
                 <StatCard 
                    title="Total Orders" 
                    value={totalOrders} 
                    subValue="vs last period" 
                    trend={-2.4} 
                    icon={ShoppingBag} 
                    color={{bg: 'bg-blue-500', text: 'text-blue-600'}} 
                 />
                 <StatCard 
                    title="Avg Order Value" 
                    value={`$${Math.round(avgOrderValue)}`} 
                    subValue="vs last period" 
                    trend={5.1} 
                    icon={FileText} 
                    color={{bg: 'bg-purple-500', text: 'text-purple-600'}} 
                 />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Profit Analysis Chart */}
                 <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Revenue & Profit Trends</h3>
                        <button className="text-xs text-indigo-600 hover:underline">View Details</button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={profitData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev2)" />
                                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Sales by Category */}
                 <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">Sales by Category</h3>
                    <div className="h-[250px] w-full">
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
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {categoryData.slice(0, 3).map((cat, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: cat.color}}></span>
                                    <span className="text-gray-600 dark:text-gray-300">{cat.name}</span>
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">${cat.value}k</span>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
          </div>
       )}

       {/* INVENTORY REPORT VIEW */}
       {reportType === 'inventory' && (
           <div className="space-y-6">
               {/* Inventory Metrics */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                                <Package size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Asset Value</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${(inventoryValue/1000).toFixed(1)}k</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Layers size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Stock Count</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalStock.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{lowStockItems.length} Items</h3>
                            </div>
                        </div>
                    </div>
               </div>

               {/* Inventory Value Chart */}
               <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6">Inventory Value by Category</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stockValueByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(99, 102, 241, 0.1)'}}
                                    contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
               </div>

               {/* Low Stock Table */}
               <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                       <h3 className="font-bold text-gray-900 dark:text-white">Critical Stock Levels</h3>
                       <button className="text-sm text-indigo-600 font-medium hover:underline">Reorder All</button>
                   </div>
                   <table className="w-full text-left border-collapse">
                       <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase">
                           <tr>
                               <th className="px-6 py-3">Product Name</th>
                               <th className="px-6 py-3">Category</th>
                               <th className="px-6 py-3">Supplier</th>
                               <th className="px-6 py-3 text-right">Current Stock</th>
                               <th className="px-6 py-3 text-right">Min Level</th>
                               <th className="px-6 py-3 text-right">Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                           {lowStockItems.length === 0 ? (
                               <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No critical items. Inventory is healthy.</td></tr>
                           ) : (
                               lowStockItems.map(p => (
                                   <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                       <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{p.name}</td>
                                       <td className="px-6 py-3 text-sm text-gray-500">{p.category}</td>
                                       <td className="px-6 py-3 text-sm text-gray-500">{p.supplier}</td>
                                       <td className="px-6 py-3 text-right font-mono text-red-600 font-bold">{p.stock}</td>
                                       <td className="px-6 py-3 text-right font-mono text-gray-500">{p.minStock}</td>
                                       <td className="px-6 py-3 text-right">
                                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                               Restock Needed
                                           </span>
                                       </td>
                                   </tr>
                               ))
                           )}
                       </tbody>
                   </table>
               </div>
           </div>
       )}
    </div>
  );
};

export default ReportsView;