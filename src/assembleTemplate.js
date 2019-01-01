const assembleTemplate = function() {
  return this.template
    .map(section => {
      if (section.type === 'exp' || section.type === 'html') {
        try {
          return eval(section.string);
        } catch (e) {
          return section.string;
        }
      }
      if (section.type === 'func') {
        return "'" + section.string + "'";
      }
      return section.string;
    })
    .join('');
};

module.exports = assembleTemplate;
