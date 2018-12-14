const elementFactory = (name, HTML, store, functions) => {
  if (!customElements.get(name)) {
    customElements.define(
      name,
      class Component extends HTMLElement {
        constructor() {
          super();
          this.store = store;
          for (let func in functions) {
            this[func] = functions[func];
          }
        }
        getStore() {
          this.store.showAll();
        }
      },
    );
  }
  const newElement = document.createElement(name);
  console.log(newElement);
  newElement.innerHTML = HTML;
  return newElement;
};

module.exports = elementFactory;
