/**
 * 判別 Schema 是否為合法的物件 Schema 結構
 *
 * @param {*} schema
 * @returns {computed} 合法的物件 Schema 結構會回傳 true，否則回傳 false
 */
const isValidObjectSchema = (schema: any): boolean => {
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
 * @returns {computed} 合法的陣列 Schema 結構會回傳 true，否則回傳 false
 */
const isValidArraySchema = (schema: any): boolean => {
  return (
    schema &&
    schema.type === 'array' &&
    !!schema.items &&
    Object.keys(schema.items).length > 0
  );
};

export { isValidArraySchema, isValidObjectSchema };
