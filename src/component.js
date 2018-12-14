const elementFactory = (HTML, name) => {
  customElements.define(name, class Component extends HTMLElement {
    constructor(HTMLString, name) {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = HTMLString;
    }
  });
  return document.createElement(name, HTML);
}

module.exports = elementFactory;
