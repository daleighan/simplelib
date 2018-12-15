const createStore = require('./store');

const createTemplate = string => {
  string = string.replace(/(\r\n\t|\n|\r\t)/gm, '');
  let expressions = [];
  let insideExp = false;
  let isExp = false;
  let currentSection = '';
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{' && string[i + 2] === '{') {
      if (string[i + 1] === 'e') {
        isExp = true;
      }
      i += 3;
      expressions.push({
        string: currentSection,
        type: 'str',
      });
      currentSection = '';
      insideExp = true;
    } else if (string[i] === '}' && string[i + 1] === '}') {
      expressions.push({
        string: currentSection,
        type: isExp ? 'exp' : 'func',
      });
      insideExp = false;
      isExp = false;
      currentSection = '';
      i += 2;
    }
    currentSection += string[i];
  }
  expressions.push({
    string: currentSection,
    type: 'str',
  });
  return expressions;
};

const assembleTemplate = function() {
  return this.template
    .map(item => {
      if (item.type === 'exp') {
        return eval(item.string);
      }
      if (item.type === 'func') {
        return item.string;
      }
      return item.string;
    })
    .join('');
};

const elementFactory = (name, HTML, store, functions, eventListeners) => {
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
          this.store = store;
          Object.assign(this, functions);
          this.store.connect(this);
          this.context = this;
          this.template = createTemplate(HTML);
        }
        getStore() {
          this.store.showAll();
        }
        render() {
          let child = new DOMParser().parseFromString(
            assembleTemplate.call(this),
            'text/html',
          ).body.firstChild;
          this.appendChild(child);
          return child;
        }
      },
    );
    let newElement = document.createElement(name);
    let child = newElement.render();
    child.context = newElement;
    let queue = [child];
    while (queue.length) {
      let current = queue.shift();
      current.context = newElement;
      queue = current.children
        ? queue.concat(Array.from(current.children))
        : queue;
    }
    newElement.appendChild(child);
    return newElement;
  } else {
    throw 'Element name is already taken. Please use a unique identifier for each new element.';
  }
};

module.exports = elementFactory;
