const elementFactory = (name, HTML, store, functions) => {
  if (!name.match('-')) {
    throw 'Invalid custom element name. Each custom element name must contain at list one "-" character'
  }
  if (!customElements.get(name)) {
    customElements.define(
      name,
      class Component extends HTMLElement {
        constructor() {
          super();
          this.store = store;
          Object.assign(this, functions);
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
    newElement.appendChild(child);
    return newElement;
  } else {
    throw "Element name is already taken. Please use a unique identifier for each new element."
  } 
};

module.exports = elementFactory;
