import React, { useState } from 'react';
import { Staff, Task, TaskHistory } from '../types';
import { 
  Search, Plus, Edit2, Trash2, Mail, Phone, Calendar, User, 
  Filter, LayoutGrid, List, Eye, Users, UserCheck, UserX, UserPlus, X,
  ClipboardList
} from 'lucide-react';
import StaffModal from './StaffModal';
import StaffDetailsView from './StaffDetailsView';
import StaffTaskBoard from './StaffTaskBoard';
import TaskModal from './TaskModal';
import TaskDetailsView from './TaskDetailsView';
import { MOCK_STAFF, MOCK_TASKS } from '../constants';

const StaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>(MOCK_STAFF);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  // View Modes
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'tasks'>('grid');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Statistics Calculations
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter(s => s.status === 'Active').length;
  const inactiveStaff = staffList.filter(s => s.status === 'Inactive').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newJoiners = staffList.filter(s => {
      const joinDate = new Date(s.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
  }).length;

  const handleAdd = () => {
    if (viewMode === 'tasks') {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    } else {
        setEditingStaff(null);
        setIsModalOpen(true);
    }
  };

  const handleEdit = (staff: Staff, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (staffData: Omit<Staff, 'id'> | Staff) => {
    if ('id' in staffData) {
      // Update existing
      setStaffList(prev => prev.map(s => s.id === staffData.id ? staffData as Staff : s));
    } else {
      // Add new
      const newStaff: Staff = {
        ...staffData,
        id: Math.random().toString(36).substr(2, 9),
        // Add default mocks for new staff
        salary: 50000, currency: 'USD', shift: '09:00 AM - 05:00 PM',
        leaveBalance: { sick: 10, casual: 10, paid: 10 }, performanceRating: 0, attendance: 100
      } as Staff;
      setStaffList(prev => [newStaff, ...prev]);
    }
  };

  // Task Handlers
  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
      const timestamp = new Date().toISOString();
      const currentUser = 'Admin'; // Mock user

      if ('id' in taskData) {
          setTasks(prev => prev.map(t => {
              if (t.id === taskData.id) {
                  const history = t.history || [];
                  const newEntries: TaskHistory[] = [];

                  // Check for assignee change
                  if (t.assigneeId !== taskData.assigneeId) {
                       const oldName = staffList.find(s => s.id === t.assigneeId)?.name || 'Unknown';
                       const newName = staffList.find(s => s.id === taskData.assigneeId)?.name || 'Unknown';
                       newEntries.push({
                           id: Math.random().toString(36).substr(2, 9),
                           action: `Reassigned from ${oldName} to ${newName}`,
                           timestamp,
                           user: currentUser
                       });
                  }
                  
                  // Check status change
                  if (t.status !== taskData.status) {
                        newEntries.push({
                           id: Math.random().toString(36).substr(2, 9),
                           action: `Status updated to ${taskData.status}`,
                           timestamp,
                           user: currentUser
                       });
                  }

                  const updatedTask = { 
                      ...taskData, 
                      history: [...history, ...newEntries] 
                  } as Task;
                  
                  // If currently viewing this task, update the view as well
                  if (selectedTask?.id === t.id) {
                      setSelectedTask(updatedTask);
                  }
                  
                  return updatedTask;
              }
              return t;
          }));
      } else {
          const newTask: Task = {
              ...taskData,
              id: Math.random().toString(36).substr(2, 9),
              completedDate: taskData.status === 'Completed' ? new Date().toISOString() : undefined,
              history: [{
                  id: Math.random().toString(36).substr(2, 9),
                  action: 'Task created',
                  timestamp,
                  user: currentUser
              }]
          } as Task;
          setTasks(prev => [newTask, ...prev]);
      }
  };

  const handleDeleteTask = (taskId: string) => {
      if (confirm('Delete this task?')) {
          setTasks(prev => prev.filter(t => t.id !== taskId));
          if (selectedTask?.id === taskId) setSelectedTask(null);
      }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
      setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
              const history = t.history || [];
              const updatedTask = { 
                  ...t, 
                  status: newStatus,
                  completedDate: newStatus === 'Completed' ? new Date().toISOString() : undefined,
                  history: [
                      ...history,
                      {
                          id: Math.random().toString(36).substr(2, 9),
                          action: `Status changed to ${newStatus}`,
                          timestamp: new Date().toISOString(),
                          user: 'Admin'
                      }
                  ]
              };
              
              if (selectedTask?.id === t.id) {
                  setSelectedTask(updatedTask);
              }

              return updatedTask;
          }
          return t;
      }));
  };

  // Filter Logic
  const filteredStaff = staffList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDepartment === 'All' || s.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const uniqueDepartments = Array.from(new Set(staffList.map(s => s.department)));

  // View Routing
  if (selectedTask) {
      return (
        <TaskDetailsView 
            task={selectedTask}
            staffList={staffList}
            onBack={() => setSelectedTask(null)}
            onStatusChange={(status) => handleStatusChange(selectedTask.id, status)}
        />
      );
  }

  if (selectedStaff) {
      return <StaffDetailsView staff={selectedStaff} onBack={() => setSelectedStaff(null)} />;
  }

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
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
           <p className="text-sm text-gray-500 mt-1">Manage employees, roles, tasks, and permissions.</p>
        </div>
        <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
            <Plus size={16} /> {viewMode === 'tasks' ? 'Assign Task' : 'Add Staff'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Staff" 
            value={totalStaff} 
            icon={Users} 
            colorClass="bg-indigo-500 text-indigo-600" 
          />
          <StatCard 
            title="Active Now" 
            value={activeStaff} 
            icon={UserCheck} 
            colorClass="bg-emerald-500 text-emerald-600" 
            subText={`${Math.round((activeStaff/totalStaff)*100 || 0)}% Workforce`}
          />
           <StatCard 
            title="Active Tasks" 
            value={tasks.filter(t => t.status === 'In Progress').length} 
            icon={ClipboardList} 
            colorClass="bg-blue-500 text-blue-600" 
            subText="In Progress"
          />
          <StatCard 
            title="Completed Tasks" 
            value={tasks.filter(t => t.status === 'Completed').length} 
            icon={UserX} 
            colorClass="bg-gray-500 text-gray-600" 
            subText="This Week"
          />
      </div>

      {/* Toolbar & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 p-1">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder={viewMode === 'tasks' ? "Search tasks..." : "Search staff by name, role, or email..."}
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
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                    <button 
                        onClick={() => setViewMode('tasks')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'tasks' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        title="Task Board"
                    >
                        <ClipboardList size={18} />
                    </button>
                </div>
                {viewMode !== 'tasks' && (
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
                )}
            </div>
        </div>

        {/* Filter Panel (Only for Staff Views) */}
        {showFilters && viewMode !== 'tasks' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Department</label>
                    <select 
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="All">All Departments</option>
                        {uniqueDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
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
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => {
                            setFilterDepartment('All');
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
            {filteredStaff.map(staff => (
                <div key={staff.id} onClick={() => setSelectedStaff(staff)} className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {staff.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{staff.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{staff.role}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                    staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                    staff.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                                    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                }`}>
                                    {staff.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Mail size={16} className="text-gray-400"/>
                                {staff.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Phone size={16} className="text-gray-400"/>
                                {staff.phone}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <User size={16} className="text-gray-400"/>
                                {staff.department} Department
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Calendar size={16} className="text-gray-400"/>
                                Joined {new Date(staff.joinDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                        <button 
                            onClick={(e) => handleEdit(staff, e)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button 
                            onClick={(e) => handleDelete(staff.id, e)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
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
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Department</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredStaff.map(staff => (
                            <tr key={staff.id} onClick={() => setSelectedStaff(staff)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{staff.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{staff.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{staff.department}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                        staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                        staff.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                                        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                    }`}>
                                        {staff.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex flex-col">
                                        <span>{staff.email}</span>
                                        <span className="text-xs">{staff.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" title="View Details">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={(e) => handleEdit(staff, e)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={(e) => handleDelete(staff.id, e)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" title="Delete">
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

      {/* Task Board View */}
      {viewMode === 'tasks' && (
          <div className="animate-in fade-in duration-300">
              <StaffTaskBoard 
                  tasks={tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()))} 
                  staffList={staffList}
                  onEditTask={(task) => {
                      setEditingTask(task);
                      setIsTaskModalOpen(true);
                  }}
                  onViewTask={(task) => setSelectedTask(task)}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
              />
          </div>
      )}

      {/* Fallback for empty states */}
      {filteredStaff.length === 0 && viewMode !== 'tasks' && (
          <div className="text-center py-12">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <User size={32} />
             </div>
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">No staff members found</h3>
             <p className="text-gray-500 mt-1">Try adjusting your search terms or filters.</p>
             <button 
                onClick={() => {
                    setFilterDepartment('All');
                    setFilterStatus('All');
                    setSearchTerm('');
                }}
                className="mt-3 text-indigo-600 hover:underline text-sm font-medium"
             >
                 Clear all filters
             </button>
          </div>
      )}

      {/* Staff Modal */}
      <StaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingStaff}
      />

      {/* Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        staffList={staffList}
        initialData={editingTask}
      />
    </div>
  );
};

export default StaffManagement;