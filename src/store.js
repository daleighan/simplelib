const createStore = (data = {}) => {
  return {
    set: (key, val, cb) => {
      data[key] = val;
      if (cb) {
        cb();
      }
    },
    get: (key, cb) => {
      return data[key];
      if (cb) {
        cb();
      }
    },
    showAll: cb => {
      console.log(data);
      if (cb) {
        cb();
      }
    },
    delete: prop => {
      delete data[prop];
      if (cb) {
        cb();
      }
    },
  };
};

module.exports = createStore;
