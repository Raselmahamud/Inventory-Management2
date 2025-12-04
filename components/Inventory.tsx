import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Filter, Plus, Edit2, Trash2, BrainCircuit } from 'lucide-react';
import { getDemandForecast } from '../services/geminiService';

interface InventoryProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  highlightedIds?: string[]; // IDs to highlight from AI search
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Product Inventory</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
            <Filter size={20} />
          </button>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {displayProducts.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-slate-600 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold mr-3">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock <= product.minStock 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {product.stock <= product.minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleForecast(product)}
                        className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                        title="AI Forecast"
                      >
                        <BrainCircuit size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {forecastLoading === product.id && (
                   <tr>
                     <td colSpan={6} className="px-6 py-2 bg-purple-50 dark:bg-purple-900/10 text-xs text-purple-600 animate-pulse">
                       Generative AI is analyzing sales trends for {product.name}...
                     </td>
                   </tr>
                )}
                {forecastResult?.id === product.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-3 bg-purple-50 dark:bg-purple-900/10">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-purple-800 dark:text-purple-200">
                          <span className="font-semibold">AI Forecast:</span> {forecastResult.text}
                        </div>
                        <button onClick={() => setForecastResult(null)} className="text-purple-400 hover:text-purple-600 text-xs">Close</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {displayProducts.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;