import React from 'react';
import { Task, Staff } from '../types';
import { Clock, Calendar, AlertTriangle, CheckCircle, Edit2, Trash2, ArrowRight, Eye } from 'lucide-react';

interface StaffTaskBoardProps {
  tasks: Task[];
  staffList: Staff[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onViewTask: (task: Task) => void;
}

// Helpers
const getDuration = (task: Task) => {
  const start = new Date(task.startDate);
  const end = task.completedDate ? new Date(task.completedDate) : new Date();
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());
  // Calculate days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  if (task.status === 'Completed') {
      return `Took ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (task.status === 'In Progress') {
      return `Running for ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }
  return `Starts ${start.toLocaleDateString()}`;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
  }
};

interface TaskCardProps {
  task: Task;
  staffList: Staff[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onViewTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, staffList, onEditTask, onDeleteTask, onStatusChange, onViewTask }) => {
  const assignee = staffList.find(s => s.id === task.assigneeId);

  return (
      <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                      onClick={() => onViewTask(task)}
                      className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="View Details"
                  >
                      <Eye size={14} />
                  </button>
                  <button 
                      onClick={() => onEditTask(task)}
                      className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Edit"
                  >
                      <Edit2 size={14} />
                  </button>
                  <button 
                       onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Delete"
                  >
                      <Trash2 size={14} />
                  </button>
              </div>
          </div>
          
          <h4 
            onClick={() => onViewTask(task)}
            className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" 
            title={task.title}
          >
            {task.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{task.description}</p>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                      {assignee?.name.charAt(0) || '?'}
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate max-w-[80px]">
                      {assignee?.name.split(' ')[0]}
                  </span>
              </div>
              
              <div className="flex items-center gap-1 text-xs font-mono text-gray-500">
                  <Clock size={12} />
                  {getDuration(task)}
              </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex gap-2">
              {task.status !== 'Completed' && (
                  <button 
                      onClick={() => {
                          const nextStatus = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Review' : 'Completed';
                          onStatusChange(task.id, nextStatus as any);
                      }}
                      className="w-full py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
                  >
                      Next Stage <ArrowRight size={12}/>
                  </button>
              )}
               {task.status === 'Completed' && (
                  <div className="w-full py-1.5 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-lg flex items-center justify-center gap-1">
                      <CheckCircle size={12}/> Done
                  </div>
              )}
          </div>
      </div>
  );
};

const StaffTaskBoard: React.FC<StaffTaskBoardProps> = ({ tasks, staffList, onEditTask, onDeleteTask, onStatusChange, onViewTask }) => {
  const columns = [
      { id: 'Pending', label: 'To Do', icon: AlertTriangle, color: 'text-gray-500' },
      { id: 'In Progress', label: 'In Progress', icon: Clock, color: 'text-indigo-500' },
      { id: 'Review', label: 'In Review', icon: Calendar, color: 'text-amber-500' },
      { id: 'Completed', label: 'Done', icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
        {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const Icon = col.icon;
            return (
                <div key={col.id} className="flex flex-col h-full min-w-[280px]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <Icon size={16} className={col.color} />
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">{col.label}</h3>
                            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                {colTasks.length}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-800">
                        <div className="space-y-3">
                            {colTasks.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-xs">No tasks in {col.label}</div>
                            ) : (
                                colTasks.map(task => (
                                    <TaskCard 
                                      key={task.id} 
                                      task={task} 
                                      staffList={staffList}
                                      onEditTask={onEditTask}
                                      onDeleteTask={onDeleteTask}
                                      onStatusChange={onStatusChange}
                                      onViewTask={onViewTask}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default StaffTaskBoard;