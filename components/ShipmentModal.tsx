import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Shipment } from '../types';

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shipment: Omit<Shipment, 'id'> | Shipment) => void;
  initialData?: Shipment | null;
}

const ShipmentModal: React.FC<ShipmentModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const initialFormState: Omit<Shipment, 'id'> = {
    trackingId: '',
    type: 'Inbound',
    status: 'Pending',
    origin: '',
    destination: '',
    carrier: '',
    estimatedDelivery: new Date().toISOString().split('T')[0],
    itemsCount: 0,
    value: 0,
    progress: 0
  };

  const [formData, setFormData] = useState<Omit<Shipment, 'id'> | Shipment>(initialFormState);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...initialFormState,
        trackingId: `TRK-${Math.floor(Math.random() * 1000000)}` // Auto-generate ID for convenience
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    if (!initialData) setFormData(initialFormState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'itemsCount' || name === 'value' || name === 'progress' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Shipment' : 'Create New Shipment'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {initialData ? 'Update tracking details.' : 'Register a new inbound or outbound logistics entry.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tracking ID</label>
               <input 
                 type="text" name="trackingId" required 
                 value={formData.trackingId} onChange={handleChange}
                 className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
               />
            </div>
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
               <select 
                 name="type" 
                 value={formData.type} onChange={handleChange}
                 className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
               >
                 <option value="Inbound">Inbound</option>
                 <option value="Outbound">Outbound</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Origin</label>
                <input 
                  type="text" name="origin" required 
                  placeholder="City, Country"
                  value={formData.origin} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Destination</label>
                <input 
                  type="text" name="destination" required 
                  placeholder="Warehouse / City"
                  value={formData.destination} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Carrier</label>
                <input 
                  type="text" name="carrier" required 
                  placeholder="e.g. DHL, FedEx"
                  value={formData.carrier} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Est. Delivery</label>
                <input 
                  type="date" name="estimatedDelivery" required 
                  value={formData.estimatedDelivery} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Item Count</label>
                <input 
                  type="number" name="itemsCount" required min="1"
                  value={formData.itemsCount} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Total Value ($)</label>
                <input 
                  type="number" name="value" required min="0"
                  value={formData.value} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                <select 
                  name="status" 
                  value={formData.status} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Customs">Customs</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Delivered">Delivered</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Progress (%)</label>
                <input 
                  type="number" name="progress" min="0" max="100"
                  value={formData.progress} onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-sm"
            >
                Cancel
            </button>
            <button 
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium shadow-sm transition-colors text-sm"
            >
                {initialData ? 'Save Changes' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentModal;