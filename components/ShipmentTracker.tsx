import React, { useState } from 'react';
import { Shipment } from '../types';
import { MOCK_SHIPMENTS } from '../constants';
import { Truck, Plane, Ship, Package, CheckCircle, AlertTriangle, MapPin, ArrowRight, Edit2 } from 'lucide-react';
import ShipmentModal from './ShipmentModal';
import ShipmentDetailsView from './ShipmentDetailsView';

const ShipmentTracker: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const inTransit = shipments.filter(s => s.status === 'In Transit').length;
  const delayed = shipments.filter(s => s.status === 'Delayed').length;
  const delivered = shipments.filter(s => s.status === 'Delivered').length;

  const handleCreate = () => {
    setEditingShipment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shipment: Shipment, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingShipment(shipment);
    setIsModalOpen(true);
  };

  const handleSave = (shipmentData: Omit<Shipment, 'id'> | Shipment) => {
    if ('id' in shipmentData) {
      setShipments(prev => prev.map(s => s.id === shipmentData.id ? shipmentData as Shipment : s));
    } else {
      const newShipment: Shipment = {
        ...shipmentData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setShipments(prev => [newShipment, ...prev]);
    }
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Delayed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
      case 'Customs': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCarrierIcon = (carrier: string) => {
    if (carrier.includes('Air') || carrier.includes('DHL') || carrier.includes('FedEx')) return <Plane size={18} />;
    if (carrier.includes('Sea') || carrier.includes('Maersk')) return <Ship size={18} />;
    return <Truck size={18} />;
  };

  if (selectedShipment) {
    return <ShipmentDetailsView shipment={selectedShipment} onBack={() => setSelectedShipment(null)} />;
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipment Tracker</h2>
           <p className="text-sm text-gray-500 mt-1">Real-time logistics tracking and timeline.</p>
        </div>
        <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
            <Package size={16} /> Create Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">In Transit</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{inTransit}</h3>
           </div>
           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <Truck size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">Delivered (This Week)</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{delivered}</h3>
           </div>
           <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
              <CheckCircle size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm font-medium text-gray-500">Delayed</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{delayed}</h3>
           </div>
           <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Shipment List */}
        <div className="xl:col-span-2 space-y-4">
           {shipments.map(shipment => (
             <div 
                key={shipment.id} 
                onClick={() => setSelectedShipment(shipment)}
                className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group"
             >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                   <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getStatusColor(shipment.status).split(' ')[0]} ${getStatusColor(shipment.status).split(' ')[1]}`}>
                         {getCarrierIcon(shipment.carrier)}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                             <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{shipment.trackingId}</h4>
                             <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{shipment.carrier}</span>
                         </div>
                         <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                             <span className="font-medium">{shipment.origin}</span>
                             <ArrowRight size={14} />
                             <span className="font-medium">{shipment.destination}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="text-right">
                         <span className={`block px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(shipment.status)}`}>
                             {shipment.status}
                         </span>
                         <span className="block text-xs text-gray-500 mt-1">Est: {shipment.estimatedDelivery}</span>
                      </div>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-4">
                   <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                      <span>Processed</span>
                      <span>In Transit</span>
                      <span>Customs</span>
                      <span>Delivered</span>
                   </div>
                   <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700">
                      <div style={{ width: `${shipment.progress}%` }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${shipment.status === 'Delayed' ? 'bg-red-500' : 'bg-indigo-600'}`}></div>
                   </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                   <div className="text-gray-500">
                       <span className="font-medium text-gray-900 dark:text-white">{shipment.itemsCount}</span> Items • Value: <span className="font-medium text-gray-900 dark:text-white">${shipment.value.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => handleEdit(shipment, e)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs uppercase tracking-wide">
                            View Details
                        </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Right: Map Placeholder / Timeline */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Live Map</h3>
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                  <div className="z-10 text-center">
                      <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Interactive Map Integration</p>
                  </div>
                  {/* Mock Dots */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-indigo-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
           </div>

           <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-6">
                 <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                       <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 my-1"></div>
                    </div>
                    <div className="pb-4">
                       <p className="text-sm font-medium text-gray-900 dark:text-white">Shipment #TRK-992102 Delivered</p>
                       <p className="text-xs text-gray-500">2 hours ago • Seattle, WA</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                       <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                       <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 my-1"></div>
                    </div>
                    <div className="pb-4">
                       <p className="text-sm font-medium text-gray-900 dark:text-white">Customs Clearance Pending</p>
                       <p className="text-xs text-gray-500">5 hours ago • #TRK-772819</p>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                       <p className="text-sm font-medium text-gray-900 dark:text-white">New Inbound Created</p>
                       <p className="text-xs text-gray-500">1 day ago • 500 units from Shenzhen</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <ShipmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingShipment}
      />
    </div>
  );
};

export default ShipmentTracker;