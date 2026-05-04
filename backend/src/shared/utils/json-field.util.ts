export function serializeJson(data: any): string | null {
  if (data === null || data === undefined) return null;
  return JSON.stringify(data);
}

export function deserializeJson<T = any>(data: string | null | undefined): T | null {
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

// Para arrays JSON guardados como string
export function serializeArray(arr: any[] | undefined | null): string {
  if (!arr || arr.length === 0) return '[]';
  return JSON.stringify(arr);
}

export function deserializeArray<T = any>(data: string | null | undefined): T[] {
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
