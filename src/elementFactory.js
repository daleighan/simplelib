const createStore = require('./store');

const createTemplate = string => {
  string = string.replace(/(\r\n\t|\n|\r\t)/gm,"");
  let expressions = [];
  let toSlice = [];
  let insideExp = false;
  let isExp = false;
  let currentSection = '';
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{' && string[i + 2] === '{') {
      i += 3
      expressions.push({
        string: currentSection,
        type: 'str',
      });
      currentSection = '';
      insideExp = true;
      if (string[i - 1] === 'e') {
        isExp = true;
      }
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
  console.log('expressions: ', expressions);
  return expressions;
};

const assembleTemplate = function() {
  let expressions = [...this.template.expressions];
  let partials = [...this.template.partials];
  let output = '';
  while (expressions.length && partials.length) {
    output += partials.shift();
    if (expressions.length) {
      let currentExp = expressions.shift();
      console.log('exp', currentExp);
      let result = eval(currentExp);
      console.log('result', result);
      if (typeof result === 'function') {
        console.log(this.store.showAll());
        console.log('stringy', result.toString());
        output += `"(${result.toString()})()"`;
      } else if (result !== undefined) {
        output += result;
      } else {
        output += currentExp;
      }
    }
  }
  output += partials.shift();
  console.log('output', output);
  return output;
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
          console.log('child', child);
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
