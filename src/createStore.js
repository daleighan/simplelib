const createStore = (data = {}, name='default-store', isDebug = false, connectedElements = []) => {
  if (isDebug) {
    console.log(
      `%c store debugging turned on for ${name}`,
      'color: purple; font-size: 13px',
    );
  }
  return {
    set: (updateObj, cb) => {
      if (isDebug) {
        console.log(
          `%c ${name} before: `,
          'color: red; font-size: 13px',
          data,
        );
      }
      data = {...data, ...updateObj};
      if (isDebug) {
        console.log(
          `%c ${name} after: `,
          'color: green; font-size: 13px;',
          data,
        );
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
    showConnectedElements: () => {
      return [...connectedElements];
    },
  };
};

module.exports = createStore;
