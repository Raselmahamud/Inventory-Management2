export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  location: string;
  warehouseId: string; // Linked to Warehouse ID
  lastSold?: string;
}

export interface SaleData {
  date: string;
  revenue: number;
  orders: number;
  [key: string]: any;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

export interface Warehouse {
  id: string;
  name: string;
  capacity: number;
  used: number;
  temperature?: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  department: string;
  joinDate: string;
  // Detailed fields
  salary: number;
  currency: string;
  shift: string;
  leaveBalance: {
    sick: number;
    casual: number;
    paid: number;
  };
  performanceRating: number; // 1-5
  attendance: number; // Percentage
}

export interface TaskHistory {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string; // Links to Staff ID
  status: 'Pending' | 'In Progress' | 'Completed' | 'Review';
  priority: 'High' | 'Medium' | 'Low';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  history?: TaskHistory[];
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  role: string;
  month: string; // e.g., "October 2024"
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paymentDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  rating: number; // 1-5
  status: 'Active' | 'Inactive' | 'Pending';
  lastOrderDate: string;
  location: string;
  joinDate: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  type: 'Inbound' | 'Outbound';
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Customs';
  origin: string;
  destination: string;
  carrier: string;
  estimatedDelivery: string;
  itemsCount: number;
  value: number;
  progress: number; // 0-100
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  WAREHOUSE = 'WAREHOUSE',
  SUPPLIERS = 'SUPPLIERS',
  SHIPMENTS = 'SHIPMENTS',
  STAFF = 'STAFF',
  PAYROLL = 'PAYROLL',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE',
}

export interface AIResponse {
  text: string;
  action?: 'FILTER' | 'NAVIGATE' | 'NONE';
  filterCriteria?: Partial<Product>;
  targetView?: ViewState;
}