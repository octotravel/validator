export const safeJson = (value: unknown): string | null => {
  return value != null ? JSON.stringify(value) : null;
};
