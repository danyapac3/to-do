const createStore = ({initState, actions, onAction}) => {
  const state = initState();

  if (typeof(state) !== 'object' || state === null ) {
    throw new Error('State has to be an object');
  }

  const callbacks = [];

  const storeBuiltIns = {
    $state: state,

    $onAction(callback, addStart) {
      if (addStart) {
        callbacks.unshift(callback);
      } else {
        callbacks.push(callback);
      }
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
        result.then(returnValue => {callbacks.forEach(cb => cb({name, store, args, returnValue}))});
        return;
      }
      callbacks.forEach(cb => cb({ name, store, args, returnValue: result }));
      onAction?.({name, state});
      return result;
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

export default ({initState, actions, onAction}) => {
  const store = createStore({initState, actions, onAction});
  return () => store;
};