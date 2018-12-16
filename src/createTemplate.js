const createTemplate = string => {
  string = string.trim().replace(/\s\s+/g, ' ');
  let sections = [];
  let insideExp = false;
  let isExp = false;
  let currentSection = '';
  for (let i = 0; i < string.length; i++) {
    if (string[i] === '{' && string[i + 2] === '{') {
      if (string[i + 1] === 'e') {
        isExp = true;
      }
      i += 3;
      sections.push({
        string: currentSection,
        type: 'str',
      });
      currentSection = '';
      insideExp = true;
    } else if (string[i] === '}' && string[i + 1] === '}') {
      sections.push({
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
  sections.push({
    string: currentSection,
    type: 'str',
  });
  return sections;
};

module.exports = createTemplate;
