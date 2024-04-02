export const useValidator = (state: any, rawSchema: any, schema: any) => {
  const rules = traverseSchemaToRules(rawSchema);
  const stateValidator = reactive(traverseSchemaToStateValidator(schema));

  // 驗證器處理器
  function stateValidatorHandler(
    paths: any,
    newValue: any,
    currentStateValidator: any,
    lastParentState: any
  ) {
    // 取得當層的驗證規則
    const currentRulesObj = getRulesByPaths(rules, paths, paths.length);
    let invalidMessage = '';
    // 遍歷所有規則
    for (const ruleKey in currentRulesObj) {
      // 當驗證失敗，取得訊息並中斷遍歷(把 lastParentState 傳入是為了讓"部分"驗證器可以取得其他欄位的值)
      if (!currentRulesObj[ruleKey].$validator(newValue, lastParentState)) {
        invalidMessage = getValidationMessage({
          ruleKey: ruleKey,
          currentRuleValidator: currentRulesObj[ruleKey],
          model: newValue
        });
        break;
      }
    }
    // 更新驗證器的狀態
    currentStateValidator.$dirty = true;
    currentStateValidator.$invalid = false;
    currentStateValidator.$message = '';
    if (invalidMessage.length > 0) {
      currentStateValidator.$invalid = true;
      currentStateValidator.$message = invalidMessage;
    }
    currentStateValidator.$model = newValue;
  }

  // 陣列驗證器處理器(array-object, array-primitive)
  function arrayStateValidatorHandler(
    paths: any,
    newArray: any,
    currentStateValidator: any,
    lastParentState: any
  ) {
    // 取得當層的驗證規則
    const currentRulesObj = getRulesByPaths(rules, paths, paths.length);
    let invalidMessage = '';
    // 遍歷所有規則
    for (const ruleKey in currentRulesObj) {
      if (ruleKey === '$each' || ruleKey === '$eachPrimitive') continue;
      // 當驗證失敗，取得訊息並中斷遍歷(把 lastParentState 傳入是為了讓"部分"驗證器可以取得其他欄位的值)
      // 但 arrayStateValidatorHandler 目前並不會取得其他欄位的值，所以 lastParentState 可以不用傳入
      if (!currentRulesObj[ruleKey].$validator(newArray, lastParentState)) {
        invalidMessage = getValidationMessage({
          ruleKey: ruleKey,
          currentRuleValidator: currentRulesObj[ruleKey],
          model: newArray
        });
        break;
      }
    }
    // 更新驗證器的狀態
    currentStateValidator.$dirty = true;
    currentStateValidator.$invalid = false;
    currentStateValidator.$message = '';
    if (invalidMessage.length > 0) {
      currentStateValidator.$invalid = true;
      currentStateValidator.$message = invalidMessage;
    }
  }

  // update state
  function updateState(paths: any, newValue: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列的時候 path item會是 `'i'`, i === 整數
    const lastKeyIndex = paths.length - 1;
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);

    // 更新 stateValidator
    stateValidatorHandler(
      paths,
      newValue,
      currentStateValidator,
      lastParentState
    );

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newValue;
  }

  // 新增項目
  function addArrayState(paths: any, newValue: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);

    // 新增項目
    const newArray = deepClone(lastParentState[paths[lastKeyIndex]]);
    newArray.push(newValue);

    // stateValidator 陣列驗證
    arrayStateValidatorHandler(
      paths,
      newArray,
      currentStateValidator,
      lastParentState
    );

    // 🌶️ 更新 stateValidator $eachState(新增項目)
    // 取得當層的 schema
    const currentSchema = getSchemaByPaths(schema, paths, paths.length);
    // 取得新的 $newItem
    const $newItem = traverseSchemaToStateValidatorWithModel(
      newValue,
      currentSchema.items
    );
    console.log('$newItem', $newItem);

    currentStateValidator.$eachState.push($newItem);
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;
  }

  // 刪除項目
  function removeArrayState(paths: any, arrayIndex: number) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);

    // 刪除項目
    const newArray = deepClone(lastParentState[paths[lastKeyIndex]]);
    newArray.splice(arrayIndex, 1);

    // stateValidator 陣列驗證
    arrayStateValidatorHandler(
      paths,
      newArray,
      currentStateValidator,
      lastParentState
    );

    // 更新 stateValidator $eachState(刪除項目)
    currentStateValidator.$eachState.splice(arrayIndex, 1);
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;
  }

  // 移動項目
  function moveArrayState(paths: any, fromIndex: number, toIndex: number) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);

    // 移動項目
    const newArray = deepClone(lastParentState[paths[lastKeyIndex]]);
    const [removedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, removedItem);

    // stateValidator 陣列驗證
    arrayStateValidatorHandler(
      paths,
      newArray,
      currentStateValidator,
      lastParentState
    );

    // 更新 stateValidator $eachState(移動項目)
    const [$removedItem] = currentStateValidator.$eachState.splice(
      fromIndex,
      1
    );
    currentStateValidator.$eachState.splice(toIndex, 0, $removedItem);
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;
  }

  // 刪除所有項目
  function clearArrayState(paths: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);

    // 刪除所有項目
    const newArray: any[] = [];

    // stateValidator 陣列驗證
    arrayStateValidatorHandler(
      paths,
      newArray,
      currentStateValidator,
      lastParentState
    );

    // 更新 stateValidator $eachState(刪除所有項目)
    currentStateValidator.$eachState = newArray;
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;
  }

  // watch(state, () => {
  //   console.log('State Watcher Trigger');
  // });

  return {
    // state
    stateValidator,
    rules, // 每個 rules 有 $validator fn 可以執行
    // action
    updateState,
    addArrayState,
    removeArrayState,
    moveArrayState,
    clearArrayState
  };
};
