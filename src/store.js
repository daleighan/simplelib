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

module.exports = createStore;
