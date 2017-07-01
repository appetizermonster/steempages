'use strict';

function fixImageLinks(body) {
  const re = /(!\[\]\()?(https?:\/\/.+\.(png|jpg|jpeg|gif))\)?/gm;
  return body.replace(re, '<img src="$2" style="max-width:100%;">');
}

function makeMarkdown(title, body) {
  const fixedBody = fixImageLinks(body);
  return `---\nlayout: post\ntitle: ${title}\n---\n\n${fixedBody}`;
}

module.exports = {
  makeMarkdown
};
