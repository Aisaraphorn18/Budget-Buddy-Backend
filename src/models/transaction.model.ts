export interface Transaction {
  transaction_id: number;
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  note?: string;
  created_at: string;
}

export interface CreateTransactionData {
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  note?: string;
}

export interface UpdateTransactionData {
  category_id?: number;
  type?: 'income' | 'expense';
  amount?: number;
  note?: string;
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}