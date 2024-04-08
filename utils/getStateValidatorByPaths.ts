/**
 * 取得指定層數的 stateValidator
 *
 * @param {Object} stateValidator
 * @param {Array} paths
 * @param {number} lastKeyIndex 最後一個 key 的 index
 * @returns {Object} stateValidator
 */
export default function getStateValidatorByPaths(
  validator: Record<string, any>,
  paths: unknown[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentValidator: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey)) return parentValidator[currentKey];
      else if (parentValidator.hasOwnProperty('$eachState'))
        return parentValidator['$eachState'][Number(currentKey)];
      else return parentValidator;
    }, validator);
}
