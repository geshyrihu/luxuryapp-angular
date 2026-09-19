export function globalFilterFields(data: any[]): string[] {
  if (!data || data.length === 0) return [];

  // Safely check if data[0] exists and is not null
  const firstItem = data[0];
  if (!firstItem) return []; // If the first item is null/undefined, return empty array

  // Check if the first item is a node with a data property
  if (typeof firstItem.data === 'object' && firstItem.data !== null) {
    // If it has data, get keys from that property
    return Object.keys(firstItem.data);
  }

  // Otherwise, assume it's a plain object and get its keys
  return Object.keys(firstItem);
}

export function tableRows() {
  return 30;
}
export function rowsPerPageOptions() {
  return [30, 50, 75, 100, 150, 200];
}

export const tableDefaultRows = 50;










