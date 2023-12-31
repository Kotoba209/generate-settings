function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn('Current execute action is empty!');
}

// 我们首先设置一个用于通信的Actions类

class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction,
    offGlobalStateChange: emptyAction
  };
  constructor() {}
  // 默认值为空Action

  // 设置actions
  setActions(actions) {
    this.actions = actions;
  }

  // 监听
  onGlobalStateChange(...args) {
    const { onGlobalStateChange } = this.actions;
    return onGlobalStateChange && onGlobalStateChange(...args);
  }
  // 传值
  setGlobalState(...args) {
    const { setGlobalState } = this.actions;
    return setGlobalState && setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;
