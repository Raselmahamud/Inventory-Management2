import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import WarehouseViz from './components/WarehouseViz';
import AIAssistant from './components/AIAssistant';
import AddProductModal from './components/AddProductModal';
import SettingsView from './components/SettingsView';
import StaffManagement from './components/StaffManagement';
import SupplierManagement from './components/SupplierManagement';
import ShipmentTracker from './components/ShipmentTracker';
import AdminProfile from './components/AdminProfile';
import ReportsView from './components/ReportsView';
import { ViewState, Product } from './types';
import { MOCK_PRODUCTS, MOCK_SALES_DATA, MOCK_CATEGORY_DATA, MOCK_WAREHOUSES } from './constants';
import { 
  MapPin, 
  Thermometer, 
  Box, 
  ChevronRight, 
  ArrowLeft, 
  Settings, 
  Truck, 
  ClipboardCheck, 
  Layers 
} from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [highlightedProductIds, setHighlightedProductIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Warehouse View State
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    alert(`Edit functionality for ${product.name} would open here.`);
  };

  const handleAddProductClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAIFilter = (filter: Partial<Product> | null) => {
    if (!filter) {
      setHighlightedProductIds([]);
      return;
    }
    const matches = products.filter(p => {
      let match = true;
      if (filter.category && p.category.toLowerCase() !== filter.category.toLowerCase()) match = false;
      if (filter.name && !p.name.toLowerCase().includes(filter.name.toLowerCase())) match = false;
      return match;
    });

    if (matches.length > 0) {
      setHighlightedProductIds(matches.map(p => p.id));
      setActiveView(ViewState.INVENTORY);
    } else {
      setHighlightedProductIds([]);
    }
  };

  const renderWarehouseView = () => {
    if (selectedWarehouseId) {
      const warehouse = MOCK_WAREHOUSES.find(w => w.id === selectedWarehouseId);
      const warehouseProducts = products.filter(p => p.warehouseId === selectedWarehouseId);
      const totalValue = warehouseProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
      const lowStockCount = warehouseProducts.filter(p => p.stock < p.minStock).length;

      // Mock Zones for the Floor Plan
      const zones = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4'];

      return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          {/* Detailed Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedWarehouseId(null)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{warehouse?.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wide">Operational</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={14}/> {warehouse?.id}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1"><Thermometer size={14}/> {warehouse?.temperature}°C</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50">
                    <ClipboardCheck size={16} /> Audit
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                    <Settings size={16} /> Manage
                 </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Inventory List */}
            <div className="lg:col-span-2 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase">Total Items</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{warehouseProducts.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase">Asset Value</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">${(totalValue/1000).toFixed(1)}k</p>
                    </div>
                    <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                         <p className="text-xs font-medium text-gray-500 uppercase">Alerts</p>
                         <p className="text-xl font-bold text-red-600 mt-1 flex items-center gap-2">
                             {lowStockCount} <span className="text-xs font-normal text-gray-400">Low Stock</span>
                         </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layers size={18} className="text-indigo-500"/> Current Inventory
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-xs font-semibold uppercase text-gray-500 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3 text-right">Stock</th>
                            <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {warehouseProducts.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-6 py-3">
                                <span className="font-medium text-gray-900 dark:text-white text-sm block">{p.name}</span>
                                <span className="text-xs text-gray-500">{p.sku}</span>
                            </td>
                            <td className="px-6 py-3 text-gray-500 text-sm font-mono">{p.location}</td>
                            <td className="px-6 py-3 text-right font-medium text-gray-900 dark:text-white">{p.stock}</td>
                            <td className="px-6 py-3 text-right">
                                <span className={`inline-block w-2 h-2 rounded-full ${p.stock < p.minStock ? 'bg-red-500' : 'bg-green-500'}`}></span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Right: Floor Plan & Quick Actions */}
            <div className="space-y-6">
                 {/* Floor Plan Mockup */}
                 <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden p-6">
                     <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                         <span>Floor Plan Map</span>
                         <span className="text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">Live View</span>
                     </h3>
                     <div className="grid grid-cols-4 gap-2">
                         {zones.map(zone => {
                             // Randomly assign occupancy for visual effect
                             const occupancy = Math.random(); 
                             let color = 'bg-gray-100 dark:bg-gray-700';
                             if (occupancy > 0.8) color = 'bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800';
                             else if (occupancy > 0.4) color = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800';
                             else color = 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800';

                             return (
                                 <div key={zone} className={`aspect-square rounded-lg border ${color} flex items-center justify-center relative group cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all`}>
                                     <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{zone}</span>
                                     <div className="absolute inset-x-1 bottom-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                         <div className="h-full bg-current opacity-50" style={{width: `${occupancy * 100}%`}}></div>
                                     </div>
                                 </div>
                             );
                         })}
                     </div>
                     <div className="mt-4 flex justify-between text-xs text-gray-500">
                         <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> &lt; 50%</div>
                         <div className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-400 rounded-full"></span> 50-80%</div>
                         <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full"></span> &gt; 80%</div>
                     </div>
                 </div>

                 <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white">
                     <h4 className="font-bold text-lg mb-2">Inbound Schedule</h4>
                     <p className="text-indigo-100 text-sm mb-4">2 trucks arriving today at Bay 4 & 5.</p>
                     <button className="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                         View Schedule
                     </button>
                 </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Global Logistics</h2>
            <p className="text-gray-500 mt-2">Real-time capacity monitoring and hub management across {MOCK_WAREHOUSES.length} locations.</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors">
             <Truck size={18} /> New Shipment
          </button>
        </div>

        {/* New Analytics Component */}
        <WarehouseViz warehouses={MOCK_WAREHOUSES} />
        
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Hubs</h3>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <Layers size={20} />
                    </button>
                    <button className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <Box size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_WAREHOUSES.map(wh => {
                const productCount = products.filter(p => p.warehouseId === wh.id).length;
                const utilization = Math.round((wh.used/wh.capacity)*100);
                const isHighLoad = utilization > 80;

                return (
                    <div 
                    key={wh.id} 
                    onClick={() => setSelectedWarehouseId(wh.id)}
                    className="group cursor-pointer bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        {/* Status Stripe */}
                        <div className={`absolute top-0 inset-x-0 h-1 ${isHighLoad ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{wh.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                            {wh.id} • <span className={isHighLoad ? "text-amber-500" : "text-emerald-500"}>{isHighLoad ? 'Heavy Load' : 'Optimal'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="p-2 text-gray-300 group-hover:text-indigo-400 transition-colors">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Storage Usage</span>
                                        <span className={`font-bold ${isHighLoad ? 'text-amber-600' : 'text-emerald-600'}`}>{utilization}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${isHighLoad ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                            style={{width: `${utilization}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>{wh.used.toLocaleString()} units</span>
                                        <span>{wh.capacity.toLocaleString()} max</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 dark:border-gray-700 border-dashed">
                                    <div className="flex items-center gap-2">
                                        <Thermometer size={16} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{wh.temperature}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Box size={16} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{productCount} Items</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500">Last audit: 2 days ago</span>
                            <span className="text-xs font-bold text-indigo-600 group-hover:underline">Manage Hub</span>
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return (
          <Dashboard 
            salesData={MOCK_SALES_DATA} 
            categoryData={MOCK_CATEGORY_DATA}
            products={products}
          />
        );
      case ViewState.INVENTORY:
        return (
          <Inventory 
            products={products}
            onDelete={handleDeleteProduct}
            onEdit={handleEditProduct}
            onAdd={handleAddProductClick}
            highlightedIds={highlightedProductIds}
          />
        );
      case ViewState.WAREHOUSE:
        return renderWarehouseView();
      case ViewState.SUPPLIERS:
        return <SupplierManagement />;
      case ViewState.SHIPMENTS:
        return <ShipmentTracker />;
      case ViewState.STAFF:
        return <StaffManagement />;
      case ViewState.REPORTS:
        return (
          <ReportsView 
            salesData={MOCK_SALES_DATA}
            categoryData={MOCK_CATEGORY_DATA}
            products={products}
          />
        );
      case ViewState.SETTINGS:
        return (
          <SettingsView 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
          />
        );
      case ViewState.PROFILE:
        return <AdminProfile />;
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      onNavigate={setActiveView} 
      toggleTheme={toggleTheme} 
      isDark={isDark}
    >
      {renderContent()}
      <AIAssistant products={products} onFilterApply={handleAIFilter} />
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveProduct} 
      />
    </Layout>
  );
};

export default App;