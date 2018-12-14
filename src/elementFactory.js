const elementFactory = (
  name,
  HTML,
  store,
  functions,
  eventListeners,
  slots,
) => {
  if (!name.match('-')) {
    throw 'Invalid custom element name. Each custom element name must contain at list one "-" character';
  }
  if (!customElements.get(name)) {
    customElements.define(
      name,
      class Component extends HTMLElement {
        constructor() {
          super();
          this.store = store;
          this.attachShadow({mode: 'open'});
          Object.assign(this, functions);
          this.store.connect(this);
        }
        getStore() {
          this.store.showAll();
        }
      },
    );
    let newElement = document.createElement(name);
    let child = new DOMParser().parseFromString(HTML, 'text/html').body
      .firstChild;
    child.context = newElement;
    let queue = [child];
    while (queue.length) {
      let current = queue.shift();
      current.context = newElement;
      queue = current.children
        ? queue.concat(Array.from(current.children))
        : queue;
    }
    newElement.shadowRoot.appendChild(child);
    return newElement;
  } else {
    throw 'Element name is already taken. Please use a unique identifier for each new element.';
  }
};

module.exports = elementFactory;
