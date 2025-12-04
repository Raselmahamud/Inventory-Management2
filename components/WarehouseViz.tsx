import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend
} from 'recharts';
import { Warehouse } from '../types';
import { Activity, Thermometer, Box } from 'lucide-react';

interface WarehouseVizProps {
  warehouses: Warehouse[];
}

const WarehouseViz: React.FC<WarehouseVizProps> = ({ warehouses }) => {
  // Transform data for charts
  const capacityData = warehouses.map(w => ({
    name: w.name,
    Used: w.used,
    Free: w.capacity - w.used,
    capacity: w.capacity,
    utilization: Math.round((w.used / w.capacity) * 100)
  }));

  // Mock environmental data for the "Live Monitor" aspect
  const envData = [
    { time: '08:00', temp: 21, humidity: 45 },
    { time: '10:00', temp: 22, humidity: 42 },
    { time: '12:00', temp: 24, humidity: 40 },
    { time: '14:00', temp: 23, humidity: 44 },
    { time: '16:00', temp: 22, humidity: 48 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Capacity Overview */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Box size={20} className="text-indigo-600" />
              Capacity Analytics
            </h3>
            <p className="text-sm text-gray-500">Real-time storage utilization across hubs.</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Used</span>
             <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm"></div> Free</span>
          </div>
        </div>
        
        <div className="h-[250px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={capacityData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748B', fontSize: 12, fontWeight: 500}} 
                width={100}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="Used" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={20} />
              <Bar dataKey="Free" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental Monitor */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
        <div className="mb-6">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Thermometer size={20} className="text-emerald-500" />
              Environment
            </h3>
           <p className="text-sm text-gray-500">Global average metrics.</p>
        </div>
        
        <div className="flex-1 min-w-0">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={envData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
               <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
               <Tooltip 
                 contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
               />
               <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} activeDot={{r: 6}} />
             </LineChart>
           </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center">
                <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium">Avg Temp</span>
                <span className="block text-xl font-bold text-gray-900 dark:text-white">23°C</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <span className="block text-xs text-blue-600 dark:text-blue-400 font-medium">Humidity</span>
                <span className="block text-xl font-bold text-gray-900 dark:text-white">42%</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseViz;