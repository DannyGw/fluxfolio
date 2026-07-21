/** Pick only allowed keys from an object — prevents mass assignment */
export function pick<T extends Record<string, any>>(
  obj: T,
  keys: readonly (keyof T)[]
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key as string] = obj[key];
    }
  }
  return result;
}
