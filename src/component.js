const elementFactory = (name, HTML) => {
  customElements.define(name, class Component extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
    }
  });
  const newEl = document.createElement(name);
  newEl.shadowRoot.innerHTML = HTML;
  return newEl;
}

module.exports = elementFactory;
