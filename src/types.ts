export type TableStatus = 'Empty' | 'Serving' | 'Unpaid' | 'Paid';

export type ItemSize = 'S' | 'M' | 'L';

export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  imagePath?: string;
  category: string;
  description?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  size: ItemSize;
  quantity: number;
  price: number;
  note?: string;
}

export interface Table {
  id: number;
  status: TableStatus;
  currentOrder: OrderItem[];
}

export interface PaymentRecord {
  id: string;
  tableId: number;
  items: OrderItem[];
  total: number;
  timestamp: number;
}
