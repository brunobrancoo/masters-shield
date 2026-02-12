/**
 * Utility functions for filtering and processing API responses
 */

/**
 * Checks if an object is "empty" - meaning it's null, undefined, empty array, or has no meaningful properties
 */
export function isEmptyObject(obj: any): boolean {
  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return true;
  }
  
  // Handle non-objects (primitives)
  if (typeof obj !== 'object') {
    return false;
  }
  
  // Handle empty arrays
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  // Check if object has at least one meaningful (non-null, non-undefined) property
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    return true; // Empty object {}
  }
  
  // Check if all values are null or undefined
  for (const key of keys) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      return false; // Has at least one meaningful property
    }
  }
  
  return true; // All properties are null/undefined/empty string
}

/**
 * Filters out empty objects from an array
 */
export function filterEmptyObjects<T>(arr: T[] | undefined | null): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  
  return arr.filter(item => !isEmptyObject(item));
}

/**
 * Checks if an item is meaningful (has name or index or meaningful data)
 */
export function isMeaningfulItem(item: any): boolean {
  if (isEmptyObject(item)) {
    return false;
  }
  
  // Check for key properties that indicate a real item
  return !!(
    item?.name ||
    item?.index ||
    item?.id ||
    (item?.damage && (item.damage.damage_dice || item.damage.damage_type)) ||
    item?.equipment_category ||
    item?.desc
  );
}

/**
 * Filters items that are meaningful (not empty objects or items without name/index)
 */
export function filterMeaningfulItems<T>(arr: T[] | undefined | null): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }
  
  return arr.filter(item => isMeaningfulItem(item));
}

/**
 * Process API response to remove empty objects from array fields
 */
export function sanitizeApiResponse<T extends Record<string, any>>(data: T | undefined | null, arrayFields: (keyof T)[] = []): T | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  
  const sanitized = { ...data };
  
  // Filter empty objects from specified array fields
  for (const field of arrayFields) {
    const fieldValue = sanitized[field];
    if (Array.isArray(fieldValue)) {
      (sanitized as any)[field] = filterMeaningfulItems(fieldValue);
    }
  }
  
  return sanitized;
}
