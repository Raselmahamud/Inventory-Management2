import React from 'react';
import { Task, Staff } from '../types';
import { ArrowLeft, Calendar, Clock, User, CheckCircle, AlertTriangle, History, ArrowRight } from 'lucide-react';

interface TaskDetailsViewProps {
  task: Task;
  staffList: Staff[];
  onBack: () => void;
  onStatusChange: (status: Task['status']) => void;
}

const TaskDetailsView: React.FC<TaskDetailsViewProps> = ({ task, staffList, onBack, onStatusChange }) => {
  const assignee = staffList.find(s => s.id === task.assigneeId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30';
        case 'Medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30';
        case 'Low': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30';
        default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        case 'In Progress': return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20';
        case 'Review': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
        default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const calculateDuration = () => {
    const start = new Date(task.startDate);
    const end = task.completedDate ? new Date(task.completedDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
            <ArrowLeft size={16} /> Back to Task Board
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Task Info */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
                            <div className="flex items-center gap-3 text-sm">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                                <span className="text-gray-500">Task ID: #{task.id}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <div className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${getStatusColor(task.status)}`}>
                                {task.status === 'Completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                {task.status}
                             </div>
                             {task.status !== 'Completed' && (
                                <button 
                                    onClick={() => {
                                        const next = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Review' : 'Completed';
                                        onStatusChange(next as any);
                                    }}
                                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                    Mark as {task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Review' : 'Completed'} <ArrowRight size={12}/>
                                </button>
                             )}
                        </div>
                    </div>
                    
                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {task.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <User size={16} /> Assigned To
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                    {assignee?.name.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{assignee?.name}</p>
                                    <p className="text-xs text-gray-500">{assignee?.role}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Calendar size={16} /> Timeline
                            </h3>
                             <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Start Date:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{new Date(task.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Due Date:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{calculateDuration()} Days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar / History */}
            <div className="space-y-6">
                 <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                         <History size={18} className="text-gray-400" /> Activity History
                     </h3>
                     <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-6">
                        {(task.history || []).length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No activity recorded.</p>
                        ) : (
                            [...(task.history || [])].reverse().map((entry) => (
                                <div key={entry.id} className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600 ring-4 ring-white dark:ring-[#1E293B]"></div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.action}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{entry.user}</span>
                                        <span className="text-[10px] text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                     </div>
                 </div>

                 {task.status === 'In Progress' && (
                     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4 flex gap-3">
                         <AlertTriangle size={20} className="text-blue-600 dark:text-blue-400 shrink-0" />
                         <div>
                             <h4 className="font-bold text-sm text-blue-800 dark:text-blue-200">On Track</h4>
                             <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">This task is progressing within the expected timeline.</p>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default TaskDetailsView;