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
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface Warehouse {
  id: string;
  name: string;
  capacity: number;
  used: number;
  temperature?: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  WAREHOUSE = 'WAREHOUSE',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

export interface AIResponse {
  text: string;
  action?: 'FILTER' | 'NAVIGATE' | 'NONE';
  filterCriteria?: Partial<Product>;
  targetView?: ViewState;
}