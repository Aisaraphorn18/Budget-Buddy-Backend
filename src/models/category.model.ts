/**
 * Category Model Interfaces
 *
 * Type definitions for category management in Budget Buddy.
 * Categories help organize and classify financial transactions into
 * meaningful groups (e.g., Food, Transportation, Entertainment).
 *
 * Features:
 * - Simple category structure with ID and name
 * - Support for transaction categorization
 * - Extensible design for future enhancements (icons, colors, etc.)
 */

/**
 * Category record structure
 * Represents a financial transaction category
 */
export interface Category {
  category_id: number;
  category_name: string;
}

/**
 * Data required to create a new category
 * Used for category creation endpoint validation
 */
export interface CreateCategoryData {
  category_name: string;
}

/**
 * Data for updating existing category
 * Used for category update endpoint validation
 */
export interface UpdateCategoryData {
  category_name?: string;
}
