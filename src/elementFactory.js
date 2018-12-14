const elementFactory = (name, HTML, store, functions) => {
  let context;
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
  let newElement = document.createElement(name);
  context = newElement;
  let child = new DOMParser().parseFromString(HTML, 'text/html').body.firstChild
  console.log('child', child);
  newElement.appendChild(child);
  return newElement;
};

module.exports = elementFactory;
