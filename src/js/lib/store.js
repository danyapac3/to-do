const createStore = ({state, actions}) => {
  const callbacks = [];


  const storeBuiltIns = {
    $state: state,
    $onAction(callback) {
      callbacks.push(callback);
      
      // unsubscribe function
      return () => {
        const index = callbacks.indexOf(callback);
        callbacks.splice(index, 1);
      }
    },
  }

  const actionWrapper = (action, name) => {
    return (...args) => {
      const result = action.apply(state, args);
      if (result instanceof Promise) {
        result.then(() => {callbacks.forEach(cb => cb(name, store))});
        return;
      }
      callbacks.forEach(cb => cb(name, store));
    }
  }
  
  const storeParts = [
    {obj: state},
    {obj: actions, wrapperFunction: actionWrapper},
    {obj: storeBuiltIns}
  ];

  const store = new Proxy(state, {
    get(_, prop) {
      for (let part of storeParts) {
        const value = part.obj[prop];
        if (!value) continue;
        if (part.wrapperFunction) return part.wrapperFunction(value, prop);
        return value;
      }
    },

    set(obj, prop, value) {
      if (prop in obj) {
        obj[prop] = value;
        return true;
      }
      return false;
    }
  });

  return store;
}

export default ({state, actions}) => {
  const store = createStore({state, actions});
  return () => store;
};