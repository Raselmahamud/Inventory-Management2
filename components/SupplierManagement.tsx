import React, { useState } from 'react';
import { Supplier } from '../types';
import { 
    Search, Plus, Edit2, Trash2, Mail, Phone, MapPin, Star, Filter, 
    Briefcase, LayoutGrid, List, CheckCircle, AlertCircle, X, Calendar 
} from 'lucide-react';
import SupplierModal from './SupplierModal';
import { MOCK_SUPPLIERS } from '../constants';

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Statistics
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
  const inactiveSuppliers = suppliers.filter(s => s.status === 'Inactive' || s.status === 'Pending').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newSuppliers = suppliers.filter(s => {
      const joinDate = new Date(s.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this supplier?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (supplierData: Omit<Supplier, 'id'> | Supplier) => {
    if ('id' in supplierData) {
      setSuppliers(prev => prev.map(s => s.id === supplierData.id ? supplierData as Supplier : s));
    } else {
      const newSupplier: Supplier = {
        ...supplierData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setSuppliers(prev => [newSupplier, ...prev]);
    }
  };

  // Filter Logic
  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = Array.from(new Set(suppliers.map(s => s.category)));

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
            <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Management</h2>
           <p className="text-sm text-gray-500 mt-1">Manage vendor relationships and performance.</p>
        </div>
        <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
            <Plus size={16} /> Add Supplier
        </button>
      </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Suppliers" 
            value={totalSuppliers} 
            icon={Briefcase} 
            colorClass="bg-indigo-500 text-indigo-600" 
          />
          <StatCard 
            title="Active Partners" 
            value={activeSuppliers} 
            icon={CheckCircle} 
            colorClass="bg-emerald-500 text-emerald-600" 
            subText="Currently supplying"
          />
           <StatCard 
            title="New This Month" 
            value={newSuppliers} 
            icon={Calendar} 
            colorClass="bg-blue-500 text-blue-600" 
            subText="Recent onboarding"
          />
          <StatCard 
            title="Pending/Inactive" 
            value={inactiveSuppliers} 
            icon={AlertCircle} 
            colorClass="bg-amber-500 text-amber-600" 
          />
      </div>

      {/* Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 p-1">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder="Search suppliers by name or category..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-1">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                        showFilters 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300' 
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <Filter size={18} /> Filter
                </button>
            </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="All">All Categories</option>
                        {uniqueCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select 
                         value={filterStatus}
                         onChange={(e) => setFilterStatus(e.target.value)}
                         className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => {
                            setFilterCategory('All');
                            setFilterStatus('All');
                            setSearchTerm('');
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <X size={14} /> Clear Filters
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-amber-500">
                                        <Star size={14} fill="currentColor" />
                                        <span className="font-medium">{supplier.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                supplier.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                supplier.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                                'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                            }`}>
                                {supplier.status}
                            </span>
                        </div>
                        
                        <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <span className="w-5 text-gray-400"><Mail size={16} /></span>
                                {supplier.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <span className="w-5 text-gray-400"><Phone size={16} /></span>
                                {supplier.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <span className="w-5 text-gray-400"><MapPin size={16} /></span>
                                {supplier.location}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-700 mt-3">
                                <span className="text-gray-400">Contact:</span>
                                <span className="font-medium">{supplier.contactPerson}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Last order: {supplier.lastOrderDate}</span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleEdit(supplier)}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(supplier.id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Briefcase size={16} />
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white block">{supplier.name}</span>
                                            <span className="text-xs text-gray-500">{supplier.location}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{supplier.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                        supplier.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                        supplier.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                                        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                    }`}>
                                        {supplier.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                        <Star size={14} className="text-amber-500" fill="currentColor" />
                                        {supplier.rating}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white font-medium text-xs">{supplier.contactPerson}</span>
                                        <span className="text-xs">{supplier.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(supplier)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(supplier.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
      )}

      {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Briefcase size={32} />
             </div>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">No suppliers found</h3>
             <p className="text-gray-500 mt-1">Try adjusting your search terms or filters.</p>
             <button 
                onClick={() => {
                    setFilterCategory('All');
                    setFilterStatus('All');
                    setSearchTerm('');
                }}
                className="mt-3 text-indigo-600 hover:underline text-sm font-medium"
             >
                 Clear all filters
             </button>
          </div>
      )}

      <SupplierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingSupplier}
      />
    </div>
  );
};

export default SupplierManagement;