export const useValidator = (state: any, rawSchema: any, schema: any) => {
  // toast
  const toast = useToast();
  const rules = traverseSchemaToRules(rawSchema);
  const stateValidator = reactive(traverseSchemaToStateValidator(schema, ''));
  // 用來檢查表單是否驗證失敗
  const stateIsInvalid = ref(false);

  // 更新狀態
  function updateState(paths: any, newValue: any) {
    console.log('updateState');
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列的時候 path item 會是 `'i'`, i === 整數
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
    if (!Array.isArray(lastParentState))
      lastParentState[paths[lastKeyIndex]] = newValue;
    // 只有 `array-primitive` 會進入這個分支
    else lastParentState[Number(paths[lastKeyIndex])] = newValue;
  }

  // TODO: （測試）要把 state 的資料給 stateValidator 做 $model 的參考
  // 這樣也許就不用逆向更新 stateValidator 的 $model 了

  // 新增項目(array-object, array-primitive)
  function addArrayState(paths: any, newValue: any) {
    console.log('addArrayState');
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
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

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;

    // 🌶️ 更新 stateValidator $eachState(新增項目)
    // 取得當層的 schema
    const currentSchema = getSchemaByPaths(schema, paths, paths.length);
    // 取得新的 $newItem
    const $newItem = traverseSchemaToStateValidatorWithModel(
      newValue,
      currentSchema.items,
      `${paths.join('.')}.${newArray.length - 1}`
    );
    currentStateValidator.$eachState.push($newItem);
    // 🟡 更新 stateValidator $path(不用更新，因為新增項目不會影響到其他項目的路徑)
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;
  }

  // 刪除項目(array-object, array-primitive)
  function removeArrayState(paths: any, arrayIndex: number) {
    console.log('removeArrayState');
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
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

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;

    // 更新 stateValidator $eachState(刪除項目)
    currentStateValidator.$eachState.splice(arrayIndex, 1);
    // 更新 stateValidator $path
    updateArrayEachStatePathHandler(currentStateValidator);
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;
  }

  // 移動項目(array-object, array-primitive)
  function moveArrayState(paths: any, fromIndex: number, toIndex: number) {
    console.log('moveArrayState');
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
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

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;

    // 更新 stateValidator $eachState(移動項目)
    const [$removedItem] = currentStateValidator.$eachState.splice(
      fromIndex,
      1
    );
    currentStateValidator.$eachState.splice(toIndex, 0, $removedItem);
    // 更新 stateValidator $path
    updateArrayEachStatePathHandler(currentStateValidator);
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;
  }

  // 刪除所有項目(array-object, array-primitive)
  function clearArrayState(paths: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
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

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newArray;

    // 更新 stateValidator $eachState(刪除所有項目)
    currentStateValidator.$eachState = newArray;
    // 🟡 更新 stateValidator $path(不用更新，因為已刪除所有項目)
    // 更新 stateValidator $model
    currentStateValidator.$model = newArray;
  }

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

  // 更新陣列驗證器的每個項目路徑的分流處理器(switch-case)
  function updateArrayEachStatePathHandler(currentStateValidator: any) {
    switch (currentStateValidator.$type) {
      case 'array-object':
        updateArrayObjectEachStatePath(currentStateValidator.$eachState);
        break;
      case 'array-primitive':
        updateArrayPrimitiveEachStatePath(currentStateValidator.$eachState);
        break;
      default:
        console.log(
          'currentStateValidator.$type is not `array-object` or `array-primitive`.'
        );
        break;
    }
  }

  // 更新陣列驗證器的每個項目路徑(array-primitive)
  function updateArrayPrimitiveEachStatePath(
    currentEachState: any[],
    newPathPattern: string = ''
  ) {
    for (let index = 0; index < currentEachState.length; index++) {
      const stateItem = currentEachState[index];
      const pathSnippet = stateItem.$path.split('.');
      // pop() 已改變 pathSnippet, arrayPrimitiveEachState 的 $path 的最後一個 key 是 index
      const originalIndex = Number(pathSnippet.pop());
      // 如果index未變動(而且是首層的話 newPathPattern === '')，則跳過
      if (originalIndex === index && newPathPattern === '') continue;
      // 重組新的路徑(有傳入 newPathPattern 則使用 newPathPattern，否則使用 pathSnippet.join('.'))
      const pathPattern = `${
        newPathPattern === '' ? pathSnippet.join('.') : newPathPattern
      }.${index}`;
      // 更新路徑
      stateItem.$path = pathPattern;
    }
  }

  // 更新陣列驗證器的每個項目路徑(array-object)
  function updateArrayObjectEachStatePath(
    currentEachState: any[],
    newPathPattern: string = ''
  ) {
    for (let index = 0; index < currentEachState.length; index++) {
      const stateItemObj = currentEachState[index];
      for (const propKey in stateItemObj) {
        if (Object.prototype.hasOwnProperty.call(stateItemObj, propKey)) {
          const stateItem = stateItemObj[propKey];
          const pathSnippet = stateItem.$path.split('.');
          // pop() 已改變 pathSnippet, arrayObjectEachState 的 $path 的最後一個 key 是 propKey
          const currentPropKey = pathSnippet.pop();
          // pop() 再次改變 pathSnippet, currentPropKey 前一項 key 是 index
          const originalIndex = Number(pathSnippet.pop());
          // 如果index未變動(而且是首層的話 newPathPattern === '')，則跳過
          if (originalIndex === index && newPathPattern === '') continue;
          // 重組新的路徑(有傳入 newPathPattern 則使用 newPathPattern，否則使用 pathSnippet.join('.'))
          const pathPattern = `${
            newPathPattern === '' ? pathSnippet.join('.') : newPathPattern
          }.${index}.${currentPropKey}`;
          // 更新路徑
          stateItem.$path = pathPattern;
          // 更新下層的路徑
          if (stateItem.$type === 'array-object') {
            updateArrayObjectEachStatePath(stateItem.$eachState, pathPattern);
          } else if (stateItem.$type === 'array-primitive') {
            updateArrayPrimitiveEachStatePath(
              stateItem.$eachState,
              pathPattern
            );
          }
        }
      }
    }
  }

  // 🔑 從頂層到最底層的陣列驗證器樹的 $model(array-object, array-primitive)
  // 這個可能用不到
  function updateTreeArrayModel(paths: any[]) {
    const topStateValidator = getStateValidatorByPaths(
      stateValidator,
      [paths[0]],
      1
    );
    console.log('topStateValidator', topStateValidator);
  }

  // 🎈 驗證表單(整個 state 全部驗證一遍，但每個欄位只要驗證到有錯誤就跳到下一個欄位進行驗證)
  function validateState() {
    stateIsInvalid.value = false;
    console.log('validateState');
    // 遍歷所有的驗證器
    // 驗證失敗(toast)
    stateIsInvalid.value = true;
    if (stateIsInvalid.value === true)
      toast.add({
        id: 'state_validation_failed',
        icon: 'i-heroicons-exclamation-triangle-20-solid',
        color: 'rose',
        title: '表單驗證失敗',
        description: '請檢查表單內容是否正確',
        timeout: 2000
      });
  }

  return {
    // state
    stateValidator,
    stateIsInvalid,
    // action
    updateState,
    addArrayState,
    removeArrayState,
    moveArrayState,
    clearArrayState,
    validateState
  };
};
