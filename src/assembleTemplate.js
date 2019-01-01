const assembleTemplate = function() {
  return this.template
    .map(section => {
      if (section.type === 'exp' || section.type === 'html') {
        try {
          let evaled = eval(section.string);
          if (typeof evaled === 'object') {
            return evaled.join('');
          }
          return evaled;
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
