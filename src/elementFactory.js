const createTemplate = require('./createTemplate');
const assembleTemplate = require('./assembleTemplate');
const createStore = require('./createStore');

const elementFactory = (name, HTML, store=createStore({}, `${name}-store`), functions={}) => {
  if (!name.match('-')) {
    throw 'Invalid custom element name. Each custom element name must contain at list one "-" character';
  }
  if (!customElements.get(name)) {
    customElements.define(
      name,
      class Component extends HTMLElement {
        constructor() {
          super();
          this.name = name;
          Object.assign(this, functions, store);
          this.connect(this);
          this.template = createTemplate(HTML);
        }
        getStore() {
          this.store.showAll();
        }
        render() {
          if (this.childNodes.length) {
            this.removeChild(this.childNodes[0]);
          }
          let child = new DOMParser().parseFromString(
            assembleTemplate.call(this),
            'text/html',
          ).body.firstChild;
          Object.assign(child, this);
          let queue = [child];
          while (queue.length) {
            let current = queue.shift();
            Object.assign(current, this);
            queue = current.children
              ? queue.concat(Array.from(current.children))
              : queue;
          }
          this.appendChild(child);
          return child;
        }
      },
    );
    let newElement = document.createElement(name);
    newElement.render();
    console.log(newElement.innerHTML);
    return newElement;
  } else {
    throw 'Element name is already taken. Please use a unique identifier for each new element.';
  }
};

module.exports = elementFactory;
