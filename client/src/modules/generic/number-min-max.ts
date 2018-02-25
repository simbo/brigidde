export function numberMinMax(
  num: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  return Math.min(max, Math.max(min, num));
}
