import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Filter, Plus, Edit2, Trash2, BrainCircuit, Download, X, Package } from 'lucide-react';
import { getDemandForecast } from '../services/geminiService';

interface InventoryProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  highlightedIds?: string[];
}

const Inventory: React.FC<InventoryProps> = ({ products, onDelete, onEdit, onAdd, highlightedIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [forecastLoading, setForecastLoading] = useState<string | null>(null);
  const [forecastResult, setForecastResult] = useState<{id: string, text: string} | null>(null);

  const filteredProducts = products.filter(p => 
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayProducts = highlightedIds.length > 0 
    ? products.filter(p => highlightedIds.includes(p.id)) 
    : filteredProducts;

  const handleForecast = async (product: Product) => {
    setForecastLoading(product.id);
    const result = await getDemandForecast(product.name);
    setForecastResult({ id: product.id, text: result });
    setForecastLoading(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-[calc(100vh-140px)]">
      {/* Header Toolbar */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Product Inventory</h2>
           <p className="text-slate-500 text-sm mt-1">Manage and track your products across all warehouses.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 transition-colors">
            <Filter size={20} />
          </button>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {displayProducts.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold mr-4 border border-slate-100 dark:border-slate-600">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-900 dark:text-white">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium">{product.stock} units</td>
                  <td className="px-6 py-5 text-slate-500 text-sm">
                    {product.warehouseId} <span className="text-xs bg-slate-100 dark:bg-slate-700 px-1 rounded ml-1">{product.location}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                      product.stock <= product.minStock 
                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${product.stock <= product.minStock ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      {product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleForecast(product)}
                        className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                        title="AI Forecast"
                      >
                        <BrainCircuit size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {forecastLoading === product.id && (
                   <tr>
                     <td colSpan={7} className="px-8 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
                       <div className="flex items-center gap-3 text-sm text-purple-700 dark:text-purple-300">
                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                         Generative AI is analyzing market trends for {product.name}...
                       </div>
                     </td>
                   </tr>
                )}
                {forecastResult?.id === product.id && (
                  <tr>
                    <td colSpan={7} className="px-8 py-4 bg-purple-50 dark:bg-slate-800 border-b border-purple-100 dark:border-slate-700">
                      <div className="flex justify-between items-start p-4 bg-white dark:bg-slate-700 rounded-xl border border-purple-100 dark:border-slate-600 shadow-sm">
                        <div className="text-sm text-slate-700 dark:text-slate-200">
                          <div className="flex items-center gap-2 mb-2 font-bold text-purple-700 dark:text-purple-300">
                            <BrainCircuit size={16} />
                            AI Forecast Insight
                          </div>
                          {forecastResult.text}
                        </div>
                        <button onClick={() => setForecastResult(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                            <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Package size={48} className="mb-4 opacity-50" />
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;