export function sortObjectsByProperty(
  sortBy: string,
  order: string = 'asc'
): (a: any, b: any) => number {
  const orderMultiplier = order === 'desc' ? -1 : 1;
  return (objA, objB) => {
    const a = objA[sortBy];
    const b = objB[sortBy];
    if (a > b) return 1 * orderMultiplier;
    if (a < b) return -1 * orderMultiplier;
    return 0;
  };
}
