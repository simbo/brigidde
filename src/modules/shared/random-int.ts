/**
 * random integer between min (inclusive) and max (inclusive)
 */
export function randomInt(
  min: number = 0,
  max: number = 9
): number {
  max = Math.max(min, max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
