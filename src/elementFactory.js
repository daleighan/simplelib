const createTemplate = string => {
  let expressions = [];
  let toSlice = [];
  let insideExp = false;
  let currentExp = '';
  let currentSlice = [0];
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{' && string[i - 1] === '{') {
      insideExp = true;
      currentSlice.push(i - 1);
      toSlice.push(currentSlice);
      currentSlice = [];
    } else if (string[i] === '}' && string[i + 1] === '}') {
      insideExp = false;
      expressions.push(currentExp);
      currentExp = '';
      currentSlice.push(i + 2);
    } else if (insideExp) {
      currentExp += string[i];
    }
  }
  toSlice.push(currentSlice);
  let partials = [];
  for (let slice of toSlice) {
    partials.push(string.slice(slice[0], slice[1]));
  }
  return {
    expressions,
    partials,
  };
};

const assembleTemplate = function() {
  let expressions = [...this.template.expressions];
  let partials = [...this.template.partials];
  let output = '';
  while (expressions.length && partials.length) {
    output += partials.shift();
    if (expressions.length) {
      let currentExp = expressions.shift();
      let result = eval(currentExp);
      if (result) {
        output += result;
      } else {
        output += currentExp;
      }
    }
  }
  output += partials.shift();
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
          this.store = store;
          this.attachShadow({mode: 'open'});
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
          this.shadowRoot.appendChild(child);
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
    newElement.shadowRoot.appendChild(child);
    return newElement;
  } else {
    throw 'Element name is already taken. Please use a unique identifier for each new element.';
  }
};

module.exports = elementFactory;
