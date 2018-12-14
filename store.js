const createStore = (data = {}) => {
  return {
    set: (key, val, cb) => {
      data[key] = val;
      if (cb) {
        cb();
      }
    },
    get: key => {
      return data[key];
    },
  };
};

const store = createStore();
store.set('key', 'val', () => console.log(store.get('key')));
console.log(store.get('key'));
