/**
 * 判別 Schema 是否為合法的物件 Schema 結構
 *
 * @param {*} schema
 * @returns {boolean} 合法的物件 Schema 結構會回傳 true，否則回傳 false
 */
const isValidObjectSchema = (schema: Record<string, any>): boolean => {
  return (
    schema &&
    schema.type === 'object' &&
    !!schema.properties &&
    Object.keys(schema.properties).length > 0
  );
};

/**
 * 判別 Schema 是否為合法的陣列 Schema 結構
 *
 * @param {*} schema
 * @returns {boolean} 合法的陣列 Schema 結構會回傳 true，否則回傳 false
 */
const isValidArraySchema = (schema: Record<string, any>): boolean => {
  return (
    schema &&
    schema.type === 'array' &&
    !!schema.items &&
    Object.keys(schema.items).length > 0
  );
};

/**
 * 判別 Schema Path 是否為陣列
 *
 * @description 如果是陣列 path，該字串只會有數字
 * @param {string} str
 * @returns {boolean} 回傳布林值結果
 */
const isValidArrayPath = (str: string): boolean => {
  return /^\d+$/.test(str);
};

export { isValidArrayPath, isValidArraySchema, isValidObjectSchema };
