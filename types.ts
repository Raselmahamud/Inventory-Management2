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

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  WAREHOUSE = 'WAREHOUSE',
  SUPPLIERS = 'SUPPLIERS',
  SHIPMENTS = 'SHIPMENTS',
  STAFF = 'STAFF',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

export interface AIResponse {
  text: string;
  action?: 'FILTER' | 'NAVIGATE' | 'NONE';
  filterCriteria?: Partial<Product>;
  targetView?: ViewState;
}