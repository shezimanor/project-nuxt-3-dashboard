/**
 * 取得最底層的 Parent State
 *
 * @param {Object} state
 * @param {Array} paths
 * @param {number} lastKeyIndex
 * @returns {Object} state
 */
export default function getLastParent(
  state: Record<string, any>,
  paths: string[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentState: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey)) return parentState[currentKey];
      else return parentState[Number(currentKey)];
    }, state);
}
