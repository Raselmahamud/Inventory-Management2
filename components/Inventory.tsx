import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Filter, Plus, Edit2, Trash2, BrainCircuit, X, MoreHorizontal, Download, ArrowUpDown } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product Inventory</h2>
           <p className="text-sm text-gray-500 mt-1">Manage, track, and analyze your global inventory.</p>
        </div>
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-gray-900">
                <Download size={16} /> Export
            </button>
            <button 
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                <Plus size={16} /> Add Product
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 p-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name, SKU, or category..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50">
            <Filter size={18} /> Filters
          </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-280px)]">
        <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">Category <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {displayProducts.map((product) => (
                <React.Fragment key={product.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                        <div className="h-9 w-9 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm mr-3">
                            {product.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                        ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right font-mono">
                        {product.stock}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                            <span className="text-gray-900 dark:text-white font-medium text-xs">{product.warehouseId}</span>
                            <span className="text-xs">{product.location}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        product.stock <= product.minStock 
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30'
                        }`}>
                        {product.stock <= product.minStock ? 'Low Stock' : 'Active'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleForecast(product)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md transition-colors"
                            title="AI Insight"
                        >
                            <BrainCircuit size={16} />
                        </button>
                        <button 
                            onClick={() => onEdit(product)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(product.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                    </td>
                    </tr>
                    {forecastLoading === product.id && (
                    <tr>
                        <td colSpan={7} className="px-6 py-2 bg-purple-50/50 dark:bg-purple-900/10">
                        <div className="flex items-center justify-center gap-2 text-xs text-purple-700 dark:text-purple-300 py-1">
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent"></div>
                            Analyzing demand patterns...
                        </div>
                        </td>
                    </tr>
                    )}
                    {forecastResult?.id === product.id && (
                    <tr>
                        <td colSpan={7} className="px-6 py-0 border-none">
                            <div className="my-2 mx-12 p-3 bg-purple-50 dark:bg-[#2e2344] border border-purple-100 dark:border-purple-800 rounded-lg flex items-start gap-3 shadow-sm relative">
                                <BrainCircuit className="text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" size={16} />
                                <div className="text-sm text-gray-800 dark:text-gray-200 pr-6">
                                    <span className="font-semibold block text-purple-700 dark:text-purple-300 text-xs uppercase mb-1">Forecast Insight</span>
                                    {forecastResult.text}
                                </div>
                                <button onClick={() => setForecastResult(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    )}
                </React.Fragment>
                ))}
                {displayProducts.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                <Filter size={20} />
                            </div>
                            <p className="text-sm">No products found matching your filters.</p>
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        
        {/* Pagination Footer (Mock) */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{displayProducts.length}</span> of <span className="font-medium">{products.length}</span> results
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;