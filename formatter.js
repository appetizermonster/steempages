'use strict';

function makeMarkdown(title, body) {
  return `---\nlayout: post\ntitle: ${title}\n---\n\n${body}`;
}

module.exports = {
  makeMarkdown
};
