import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import WarehouseViz from './components/WarehouseViz';
import AIAssistant from './components/AIAssistant';
import { ViewState, Product, Warehouse } from './types';
import { MOCK_PRODUCTS, MOCK_SALES_DATA, MOCK_CATEGORY_DATA, MOCK_WAREHOUSES } from './constants';
import { MapPin, FileBarChart, Thermometer, Box, ChevronRight, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [highlightedProductIds, setHighlightedProductIds] = useState<string[]>([]);
  
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

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Product',
      category: 'Uncategorized',
      sku: 'NEW-001',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: 'N/A',
      location: 'N/A',
      warehouseId: 'WH-NY'
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

      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setSelectedWarehouseId(null)}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{warehouse?.name} Inventory</h2>
              <p className="text-slate-500">Managing {warehouseProducts.length} items</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Product List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {warehouseProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">{p.sku}</td>
                      <td className="px-4 py-3 text-slate-500 text-sm">
                        <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded text-xs font-bold">
                          {p.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                         <span className={`text-sm font-semibold ${p.stock < p.minStock ? 'text-red-500' : 'text-emerald-500'}`}>
                           {p.stock}
                         </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">${(p.price * p.stock).toLocaleString()}</td>
                    </tr>
                  ))}
                  {warehouseProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No products assigned to this warehouse.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Warehouse Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor capacity and temperature across all hubs.</p>
        </div>

        <WarehouseViz warehouses={MOCK_WAREHOUSES} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_WAREHOUSES.map(wh => {
              const productCount = products.filter(p => p.warehouseId === wh.id).length;
              return (
                <div 
                  key={wh.id} 
                  onClick={() => setSelectedWarehouseId(wh.id)}
                  className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{wh.name}</h3>
                  <p className="text-sm text-slate-400 mb-6">{wh.id}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Thermometer size={16} className="mr-2" />
                        Temp
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-white">{wh.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex items-center text-slate-500 dark:text-slate-400">
                        <Box size={16} className="mr-2" />
                        Items
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-white">{productCount} SKUs</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    View Inventory <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              );
            })}
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
            onAdd={handleAddProduct}
            highlightedIds={highlightedProductIds}
          />
        );
      case ViewState.WAREHOUSE:
        return renderWarehouseView();
      case ViewState.REPORTS:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <div className="bg-slate-100 dark:bg-slate-800 p-10 rounded-full mb-6 animate-pulse">
              <FileBarChart size={64} className="opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Reports Module</h2>
            <p className="mt-2">Advanced analytics and reporting features are under development.</p>
          </div>
        );
      case ViewState.SETTINGS:
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-10 border border-slate-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">System Settings</h2>
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Appearance</h3>
                  <p className="text-slate-500 mt-1">Customize how NexStock looks on your device.</p>
                </div>
                <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-full">
                  <button 
                    onClick={() => !isDark && toggleTheme()}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!isDark ? 'text-slate-500' : 'bg-white shadow-sm text-slate-800'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => isDark && toggleTheme()}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isDark ? 'text-slate-500' : 'bg-slate-700 shadow-sm text-white'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-8 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg">Notifications</h3>
                  <p className="text-slate-500 mt-1">Get alerts for low stock and new orders.</p>
                </div>
                 <button className="w-14 h-8 bg-indigo-600 rounded-full relative transition-colors">
                    <span className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform"></span>
                 </button>
              </div>

               <div className="pt-2">
                 <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-3">API Configuration</h3>
                 <p className="text-slate-500 mb-4">Manage your integrations and keys.</p>
                 <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-slate-600 dark:text-slate-400">API Key Status</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Active</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );
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
    </Layout>
  );
};

export default App;