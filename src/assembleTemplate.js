const assembleTemplate = function() {
  return this.template
    .map(section => {
      if (section.type === 'exp') {
        return eval(section.string);
      }
      if (section.type === 'func') {
        return "'" + section.string + "'";
      }
      return section.string;
    })
    .join('');
};

module.exports = assembleTemplate;
