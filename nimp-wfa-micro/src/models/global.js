const global = {
  namespace: 'global',
  state: {
    test: 233
  },
  reducers: {
    updateMainParams(state, { payload }) {
      console.log('payload233', payload)
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {},
  subscriptions: {},
};
export default global;
