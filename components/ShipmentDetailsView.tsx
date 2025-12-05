import React from 'react';
import { Shipment } from '../types';
import { 
  ArrowLeft, Truck, MapPin, Calendar, Package, DollarSign, 
  CheckCircle, Clock, AlertTriangle, ShieldCheck, FileText 
} from 'lucide-react';

interface ShipmentDetailsViewProps {
  shipment: Shipment;
  onBack: () => void;
}

const ShipmentDetailsView: React.FC<ShipmentDetailsViewProps> = ({ shipment, onBack }) => {
  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'In Transit': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'Delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Delayed': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Customs': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const steps = [
    { label: 'Order Processed', completed: true, date: 'Oct 20, 10:00 AM' },
    { label: 'Picked Up', completed: shipment.progress > 10, date: 'Oct 20, 02:00 PM' },
    { label: 'In Transit', completed: shipment.progress > 30, date: 'Oct 21, 09:00 AM' },
    { label: 'Customs Clearance', completed: shipment.progress > 60, date: 'Pending' },
    { label: 'Out for Delivery', completed: shipment.progress > 90, date: 'Pending' },
    { label: 'Delivered', completed: shipment.progress === 100, date: 'Pending' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Shipments
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-4">
                 <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                     <Truck size={32} />
                 </div>
                 <div>
                     <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{shipment.trackingId}</h1>
                     <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-500 font-medium">{shipment.carrier}</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                         <span className="text-gray-500">{shipment.type} Shipment</span>
                     </div>
                 </div>
             </div>
             <div className="flex items-center gap-3">
                 <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(shipment.status)}`}>
                     {shipment.status}
                 </span>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
             <div>
                 <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                 <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                     <Calendar size={18} className="text-indigo-500" />
                     {shipment.estimatedDelivery}
                 </div>
             </div>
             <div>
                 <p className="text-sm text-gray-500 mb-1">Origin</p>
                 <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                     <MapPin size={18} className="text-gray-400" />
                     {shipment.origin}
                 </div>
             </div>
             <div>
                 <p className="text-sm text-gray-500 mb-1">Destination</p>
                 <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                     <MapPin size={18} className="text-gray-400" />
                     {shipment.destination}
                 </div>
             </div>
             <div>
                 <p className="text-sm text-gray-500 mb-1">Total Value</p>
                 <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                     <DollarSign size={18} className="text-emerald-500" />
                     ${shipment.value.toLocaleString()}
                 </div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline & Map */}
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-6">Shipment Progress</h3>
                  <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                      
                      <div className="space-y-8">
                          {steps.map((step, idx) => (
                              <div key={idx} className="relative flex items-start gap-4">
                                  <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 ${step.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                                      {step.completed && <CheckCircle size={14} />}
                                  </div>
                                  <div className="flex-1">
                                      <p className={`font-medium ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{step.label}</p>
                                      <p className="text-xs text-gray-400">{step.date}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Live Map Location</h3>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                       <MapPin size={48} className="text-red-500 animate-bounce relative z-10" />
                  </div>
              </div>
          </div>

          {/* Sidebar Details */}
          <div className="space-y-6">
               <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4">Cargo Details</h3>
                   <div className="space-y-4">
                       <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                           <span className="text-sm text-gray-500">Items Count</span>
                           <span className="text-sm font-medium text-gray-900 dark:text-white">{shipment.itemsCount} Units</span>
                       </div>
                       <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                           <span className="text-sm text-gray-500">Weight</span>
                           <span className="text-sm font-medium text-gray-900 dark:text-white">450 kg</span>
                       </div>
                       <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                           <span className="text-sm text-gray-500">Dimensions</span>
                           <span className="text-sm font-medium text-gray-900 dark:text-white">120x80x100 cm</span>
                       </div>
                       <div className="flex justify-between py-2">
                           <span className="text-sm text-gray-500">Packaging</span>
                           <span className="text-sm font-medium text-gray-900 dark:text-white">Palletized Box</span>
                       </div>
                   </div>
               </div>

               <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                   <h3 className="font-bold text-gray-900 dark:text-white mb-4">Documents</h3>
                   <div className="space-y-3">
                       <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                           <FileText size={20} className="text-indigo-500"/>
                           <div className="flex-1">
                               <p className="text-sm font-medium text-gray-900 dark:text-white">Commercial Invoice</p>
                               <p className="text-xs text-gray-500">PDF • 1.2 MB</p>
                           </div>
                       </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left">
                           <ShieldCheck size={20} className="text-emerald-500"/>
                           <div className="flex-1">
                               <p className="text-sm font-medium text-gray-900 dark:text-white">Insurance Policy</p>
                               <p className="text-xs text-gray-500">PDF • 850 KB</p>
                           </div>
                       </button>
                   </div>
               </div>

               <button className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2">
                   <AlertTriangle size={16} /> Report Issue
               </button>
          </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsView;