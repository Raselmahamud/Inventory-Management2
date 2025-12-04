import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import WarehouseViz from './components/WarehouseViz';
import AIAssistant from './components/AIAssistant';
import { ViewState, Product } from './types';
import { MOCK_PRODUCTS, MOCK_SALES_DATA, MOCK_CATEGORY_DATA, MOCK_WAREHOUSES } from './constants';
import { MapPin, FileBarChart } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isDark, setIsDark] = useState(false);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [highlightedProductIds, setHighlightedProductIds] = useState<string[]>([]);

  // Dark mode effect
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
    // In a real app, this would open a modal
    alert(`Edit functionality for ${product.name} would open here.`);
  };

  const handleAddProduct = () => {
    // In a real app, this would open a modal
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Product',
      category: 'Uncategorized',
      sku: 'NEW-001',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: 'N/A',
      location: 'N/A'
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAIFilter = (filter: Partial<Product> | null) => {
    if (!filter) {
      setHighlightedProductIds([]);
      return;
    }

    // Advanced filtering logic based on Gemini's returned structured criteria
    const matches = products.filter(p => {
      let match = true;
      if (filter.category && p.category.toLowerCase() !== filter.category.toLowerCase()) match = false;
      if (filter.name && !p.name.toLowerCase().includes(filter.name.toLowerCase())) match = false;
      
      // Special logic for "low stock" if passed as a string in a generic field or specific logic
      // Assuming the AI returns a custom flag or we infer it.
      // For this demo, we check if the AI returned a 'stockStatus' of 'low' (custom logic in service)
      // or if we just matched basic fields.
      
      // Let's assume if the filter object has stock < minStock implicitly if the user asked "low stock"
      // But since our type is Partial<Product>, we handle explicit value matches.
      // Implementing a simple "If category matches, highlight" for now.
      
      return match;
    });

    // If matches found, navigate to Inventory and highlight
    if (matches.length > 0) {
      setHighlightedProductIds(matches.map(p => p.id));
      setActiveView(ViewState.INVENTORY);
    } else {
      // If user asked for "low stock" specifically, let's manually check 
      // This part is a bit tricky without a rigid schema from AI, but let's try a heuristic
      // If the AI response text contains "low stock", we filter.
      // Better yet, let's rely on the service returning a specific flag if implemented.
      // For now, simple category highlighting works best for the demo.
      setHighlightedProductIds([]);
    }
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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Warehouse Management</h2>
            <WarehouseViz warehouses={MOCK_WAREHOUSES} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
               {MOCK_WAREHOUSES.map(wh => (
                 <div key={wh.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                        <MapPin size={24} />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{wh.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{wh.id}</p>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span>Temperature</span>
                        <span>{wh.temperature}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Utilization</span>
                        <span>{Math.round((wh.used/wh.capacity)*100)}%</span>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );
      case ViewState.REPORTS:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="bg-gray-100 dark:bg-slate-800 p-8 rounded-full mb-4">
              <FileBarChart size={48} className="opacity-50" />
            </div>
            <h2 className="text-xl font-semibold">Reports Module</h2>
            <p>Advanced reporting features coming soon.</p>
          </div>
        );
      case ViewState.SETTINGS:
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle application theme</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-slate-700">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-500">Receive alerts for low stock</p>
                </div>
                 <button 
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-indigo-600`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6`} />
                </button>
              </div>

               <div className="pt-2">
                 <h3 className="font-medium text-gray-900 dark:text-white mb-2">API Configuration</h3>
                 <p className="text-sm text-gray-500 mb-4">Manage your integrations and keys.</p>
                 <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                   API Key is managed via environment variables.
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