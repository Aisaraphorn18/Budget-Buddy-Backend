/**
 * Transaction Model Interfaces
 * 
 * Core type definitions for financial transaction management in Budget Buddy.
 * Transactions are the heart of the personal finance system, recording all
 * income and expense activities with proper categorization and tracking.
 * 
 * Key Features:
 * - Strong typing for income/expense classification
 * - User-scoped transaction isolation
 * - Category-based organization
 * - Flexible filtering and pagination support
 * - Partial update capabilities
 * - Optional note field for transaction details
 */

/**
 * Complete transaction record
 * Represents a financial transaction in the system
 */
export interface Transaction {
  transaction_id: number;
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';  // Transaction type classification
  amount: number;              // Transaction amount (always positive)
  note?: string;              // Optional description/memo
  created_at: string;         // ISO timestamp
}

/**
 * Data required to create a new transaction
 * Used for transaction creation endpoint validation
 */
export interface CreateTransactionData {
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  note?: string;
}

/**
 * Data for updating existing transaction
 * All fields are optional to support partial updates
 */
export interface UpdateTransactionData {
  category_id?: number;
  type?: 'income' | 'expense';
  amount?: number;
  note?: string;
}

/**
 * Filtering and pagination options for transaction queries
 * Supports advanced search and data pagination
 */
export interface TransactionFilters {
  type?: 'income' | 'expense';    // Filter by transaction type
  category_id?: number;           // Filter by category
  start_date?: string;            // Date range start (YYYY-MM-DD)
  end_date?: string;              // Date range end (YYYY-MM-DD)
  page?: number;                  // Page number for pagination
  limit?: number;                 // Items per page
}