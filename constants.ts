import { Product, SaleData, CategoryData, Warehouse, Staff, Supplier, Shipment, Task } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', category: 'Electronics', sku: 'WH-001', price: 129.99, stock: 45, minStock: 20, supplier: 'TechSply', location: 'A-12', warehouseId: 'WH-NY' },
  { id: '2', name: 'Ergonomic Chair', category: 'Furniture', sku: 'EC-500', price: 249.50, stock: 12, minStock: 15, supplier: 'OfficeLux', location: 'W-03', warehouseId: 'WH-CA' },
  { id: '3', name: 'Mechanical Keyboard', category: 'Electronics', sku: 'MK-101', price: 89.99, stock: 110, minStock: 30, supplier: 'KeyMaster', location: 'A-15', warehouseId: 'WH-TX' },
  { id: '4', name: '4K Monitor 27"', category: 'Electronics', sku: 'MN-4K27', price: 399.00, stock: 8, minStock: 10, supplier: 'VisionInc', location: 'A-02', warehouseId: 'WH-NY' },
  { id: '5', name: 'Standing Desk', category: 'Furniture', sku: 'SD-200', price: 450.00, stock: 5, minStock: 5, supplier: 'OfficeLux', location: 'W-01', warehouseId: 'WH-CA' },
  { id: '6', name: 'USB-C Dock', category: 'Accessories', sku: 'USB-D1', price: 75.00, stock: 85, minStock: 25, supplier: 'ConnectAll', location: 'B-09', warehouseId: 'WH-TX' },
  { id: '7', name: 'Webcam 1080p', category: 'Electronics', sku: 'WC-1080', price: 59.99, stock: 32, minStock: 15, supplier: 'VisionInc', location: 'A-08', warehouseId: 'WH-NY' },
  { id: '8', name: 'Laptop Stand', category: 'Accessories', sku: 'LS-ALU', price: 29.99, stock: 200, minStock: 50, supplier: 'AluWorks', location: 'B-02', warehouseId: 'WH-CA' },
  { id: '9', name: 'Noise Cancelling Mic', category: 'Electronics', sku: 'NC-MIC', price: 110.00, stock: 18, minStock: 20, supplier: 'SoundPro', location: 'A-22', warehouseId: 'WH-TX' },
  { id: '10', name: 'Smart Light Strip', category: 'Home', sku: 'SL-RGB', price: 35.00, stock: 150, minStock: 40, supplier: 'Lumina', location: 'C-05', warehouseId: 'WH-NY' },
];

export const MOCK_SALES_DATA: SaleData[] = [
  { date: 'Mon', revenue: 4000, orders: 24 },
  { date: 'Tue', revenue: 3000, orders: 18 },
  { date: 'Wed', revenue: 2000, orders: 15 },
  { date: 'Thu', revenue: 2780, orders: 20 },
  { date: 'Fri', revenue: 1890, orders: 12 },
  { date: 'Sat', revenue: 2390, orders: 19 },
  { date: 'Sun', revenue: 3490, orders: 28 },
];

export const MOCK_CATEGORY_DATA: CategoryData[] = [
  { name: 'Electronics', value: 400, color: '#6366f1' },
  { name: 'Furniture', value: 300, color: '#8b5cf6' },
  { name: 'Accessories', value: 300, color: '#ec4899' },
  { name: 'Home', value: 200, color: '#10b981' },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 'WH-NY', name: 'New York Central', capacity: 5000, used: 3200, temperature: 22 },
  { id: 'WH-CA', name: 'California West', capacity: 8000, used: 7100, temperature: 24 },
  { id: 'WH-TX', name: 'Texas Hub', capacity: 6000, used: 2500, temperature: 26 },
];

export const MOCK_STAFF: Staff[] = [
    { 
      id: '1', name: 'Alex Johnson', role: 'Warehouse Manager', email: 'alex.j@nexstock.ai', phone: '+1 (555) 010-1234', 
      status: 'Active', department: 'Operations', joinDate: '2022-03-15',
      salary: 85000, currency: 'USD', shift: '08:00 AM - 04:00 PM', 
      leaveBalance: { sick: 5, casual: 3, paid: 12 }, performanceRating: 4.8, attendance: 98
    },
    { 
      id: '2', name: 'Maria Garcia', role: 'Logistics Coordinator', email: 'maria.g@nexstock.ai', phone: '+1 (555) 010-5678', 
      status: 'Active', department: 'Logistics', joinDate: '2023-01-10',
      salary: 62000, currency: 'USD', shift: '09:00 AM - 05:00 PM',
      leaveBalance: { sick: 2, casual: 6, paid: 8 }, performanceRating: 4.5, attendance: 95
    },
    { 
      id: '3', name: 'James Wilson', role: 'Forklift Operator', email: 'james.w@nexstock.ai', phone: '+1 (555) 010-9012', 
      status: 'On Leave', department: 'Operations', joinDate: '2023-06-22',
      salary: 45000, currency: 'USD', shift: '04:00 PM - 12:00 AM',
      leaveBalance: { sick: 0, casual: 1, paid: 15 }, performanceRating: 4.2, attendance: 92
    },
    { 
      id: '4', name: 'Linda Chen', role: 'Inventory Specialist', email: 'linda.c@nexstock.ai', phone: '+1 (555) 010-3456', 
      status: 'Active', department: 'Inventory', joinDate: '2022-11-05',
      salary: 58000, currency: 'USD', shift: '09:00 AM - 05:00 PM',
      leaveBalance: { sick: 8, casual: 4, paid: 10 }, performanceRating: 4.9, attendance: 99
    },
    { 
      id: '5', name: 'Robert Taylor', role: 'Dispatcher', email: 'robert.t@nexstock.ai', phone: '+1 (555) 010-7890', 
      status: 'Inactive', department: 'Logistics', joinDate: '2021-08-30',
      salary: 52000, currency: 'USD', shift: '07:00 AM - 03:00 PM',
      leaveBalance: { sick: 0, casual: 0, paid: 0 }, performanceRating: 3.5, attendance: 85
    },
];

export const MOCK_TASKS: Task[] = [
  { 
    id: '101', 
    title: 'Conduct Q3 Inventory Audit', 
    description: 'Full count of Zone A and B in NY Warehouse.', 
    assigneeId: '1', 
    status: 'In Progress', 
    priority: 'High', 
    startDate: '2024-10-20', 
    dueDate: '2024-10-25',
    history: [
      { id: 'h1', action: 'Task created', timestamp: '2024-10-20T09:00:00Z', user: 'Admin' },
      { id: 'h2', action: 'Status changed to In Progress', timestamp: '2024-10-21T10:30:00Z', user: 'Alex Johnson' }
    ]
  },
  { 
    id: '102', 
    title: 'Update Supplier Contracts', 
    description: 'Review and renew contracts for TechSply.', 
    assigneeId: '2', 
    status: 'Pending', 
    priority: 'Medium', 
    startDate: '2024-10-26', 
    dueDate: '2024-10-30',
    history: [
      { id: 'h3', action: 'Task created', timestamp: '2024-10-24T14:15:00Z', user: 'Admin' }
    ]
  },
  { 
    id: '103', 
    title: 'Forklift Maintenance', 
    description: 'Monthly checkup for FL-03.', 
    assigneeId: '3', 
    status: 'Completed', 
    priority: 'High', 
    startDate: '2024-10-15', 
    dueDate: '2024-10-16', 
    completedDate: '2024-10-16',
    history: [
      { id: 'h4', action: 'Task created', timestamp: '2024-10-15T08:00:00Z', user: 'System' },
      { id: 'h5', action: 'Status changed to Completed', timestamp: '2024-10-16T16:45:00Z', user: 'James Wilson' }
    ]
  },
  { 
    id: '104', 
    title: 'Reorganize Bin C-05', 
    description: 'Move low moving stock to higher shelves.', 
    assigneeId: '4', 
    status: 'In Progress', 
    priority: 'Low', 
    startDate: '2024-10-21', 
    dueDate: '2024-10-24',
    history: [
      { id: 'h6', action: 'Task created', timestamp: '2024-10-21T11:00:00Z', user: 'Admin' },
      { id: 'h7', action: 'Status changed to In Progress', timestamp: '2024-10-22T09:30:00Z', user: 'Linda Chen' }
    ]
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'TechSply Global', contactPerson: 'David Miller', email: 'orders@techsply.com', phone: '+1 (555) 123-4567', category: 'Electronics', rating: 4.8, status: 'Active', lastOrderDate: '2024-10-15', location: 'Shenzhen, CN', joinDate: '2023-01-15' },
  { id: '2', name: 'OfficeLux Inc', contactPerson: 'Sarah Jenkins', email: 'sales@officelux.com', phone: '+1 (555) 987-6543', category: 'Furniture', rating: 4.5, status: 'Active', lastOrderDate: '2024-09-28', location: 'Chicago, USA', joinDate: '2023-03-10' },
  { id: '3', name: 'KeyMaster Peripherals', contactPerson: 'Mike Chen', email: 'm.chen@keymaster.io', phone: '+1 (555) 456-7890', category: 'Electronics', rating: 4.2, status: 'Active', lastOrderDate: '2024-10-02', location: 'Taipei, TW', joinDate: '2023-06-20' },
  { id: '4', name: 'Vision Displays', contactPerson: 'Emily White', email: 'support@visioninc.com', phone: '+1 (555) 789-0123', category: 'Electronics', rating: 3.9, status: 'Pending', lastOrderDate: '2024-08-15', location: 'Seoul, KR', joinDate: '2024-10-01' },
  { id: '5', name: 'ConnectAll Cables', contactPerson: 'Tom Wilson', email: 'tom@connectall.com', phone: '+1 (555) 321-6547', category: 'Accessories', rating: 4.9, status: 'Active', lastOrderDate: '2024-10-20', location: 'Berlin, DE', joinDate: '2022-11-05' },
];

export const MOCK_SHIPMENTS: Shipment[] = [
  { id: '1', trackingId: 'TRK-882910', type: 'Inbound', status: 'In Transit', origin: 'Shenzhen, CN', destination: 'WH-NY', carrier: 'DHL Express', estimatedDelivery: '2024-10-25', itemsCount: 500, value: 12500, progress: 65 },
  { id: '2', trackingId: 'TRK-992102', type: 'Outbound', status: 'Delivered', origin: 'WH-CA', destination: 'Seattle, WA', carrier: 'FedEx Ground', estimatedDelivery: '2024-10-21', itemsCount: 45, value: 3200, progress: 100 },
  { id: '3', trackingId: 'TRK-772819', type: 'Inbound', status: 'Customs', origin: 'Taipei, TW', destination: 'WH-TX', carrier: 'Maersk', estimatedDelivery: '2024-10-30', itemsCount: 1200, value: 45000, progress: 40 },
  { id: '4', trackingId: 'TRK-112003', type: 'Outbound', status: 'Pending', origin: 'WH-NY', destination: 'Boston, MA', carrier: 'UPS', estimatedDelivery: '2024-10-23', itemsCount: 12, value: 850, progress: 0 },
  { id: '5', trackingId: 'TRK-332918', type: 'Inbound', status: 'Delayed', origin: 'Seoul, KR', destination: 'WH-CA', carrier: 'Hapag-Lloyd', estimatedDelivery: '2024-11-05', itemsCount: 200, value: 54000, progress: 25 },
];

export const SYSTEM_INSTRUCTION = `
You are an intelligent inventory assistant for NexStock.
You can analyze stock data, predict trends, and help users navigate the app.
When a user asks a question, assume you have access to the product list provided in the prompt.
If the user asks to filter or find items, return a structured JSON response identifying the filter criteria.
If the user asks for a forecast, simulate a realistic prediction based on the context.
Keep responses concise and professional.
`;