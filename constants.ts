import { Product, SaleData, CategoryData, Warehouse } from './types';

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

export const SYSTEM_INSTRUCTION = `
You are an intelligent inventory assistant for NexStock.
You can analyze stock data, predict trends, and help users navigate the app.
When a user asks a question, assume you have access to the product list provided in the prompt.
If the user asks to filter or find items, return a structured JSON response identifying the filter criteria.
If the user asks for a forecast, simulate a realistic prediction based on the context.
Keep responses concise and professional.
`;