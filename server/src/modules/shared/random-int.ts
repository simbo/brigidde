/**
 * return random integer within a range of two included numbers
 */
export function randomInt(
  a: number = 0,
  b: number = 9
): number {
  const [ min, max ] = [ a, b ].sort();
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
