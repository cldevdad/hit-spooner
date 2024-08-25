export const safeParseInt = (
  value: string | null,
  defaultValue: number
): number => {
  const parsed = parseInt(value || "");
  return isNaN(parsed) ? defaultValue : parsed;
};
