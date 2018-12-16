const createStore = (data = {}, isDebug = false, connectedElements = []) => {
  return {
    set: (updateObj, cb) => {
      if (isDebug) {
        console.log('%c Store Before: ', 'color: red; font-size: 13px', data);
      }
      data = {...data, ...updateObj};
      if (isDebug) {
        console.log('%c Store After: ', 'color: green; font-size: 13px;', data);
      }
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
