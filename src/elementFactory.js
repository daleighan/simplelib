const elementFactory = (name, HTML, store, functions) => {
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
  }
  const newElement = document.createElement(name);
  newElement.innerHTML = HTML;
  return newElement;
};

module.exports = elementFactory;
