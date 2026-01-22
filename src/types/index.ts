export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  merchant: MerchantInfo;
}

export interface MerchantInfo {
  id: number;
  merchantCode: string;
  merchantName: string;
  email: string;
  role: 'ADMIN' | 'MERCHANT';
  status?: 'ACTIVE' | 'DISABLED';
}

// Backend uses camelCase
export interface Order {
  orderId: string;
  orderNumber: string;
  userId: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetail extends Order {
  merchantId: number;
  customerEmail?: string;
  customerId?: string;
  rawResponse?: string;
  errorMessage?: string;
  paymentMethod?: 'PAYPAL' | 'STRIPE';
}

// Backend returns camelCase, not snake_case
export interface PageResponse<T> {
  orders: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  page: number;
  first: boolean;
  last: boolean;
}
