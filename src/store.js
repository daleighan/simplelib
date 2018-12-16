const createStore = (data = {}, connectedElements = []) => {
  return {
    set: (updateObj, cb) => {
      data = {...data, ...updateObj};
      connectedElements.forEach(el => el.render());
      if (cb) {
        cb();
      }
    },
    get: (key, cb) => {
      return data[key];
    },
    showAll: () => {
      return {
        data: {...data},
        connectedElements: [...connectedElements],
      };
    },
    delete: (prop, cb) => {
      delete data[prop];
      if (cb) {
        cb();
      }
    },
    connect: (element, cb) => {
      connectedElements.push(element);
      if (cb) {
        cb();
      }
    },
    showConnected: () => {
      return [...connectedElements];
    },
  };
};

module.exports = createStore;
