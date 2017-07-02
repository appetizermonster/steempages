'use strict';

const dateformat = require('dateformat');

function fixTitleTag(title) {
  return title.replace('[', '(').replace(']', ')');
}

function fixImageLinks(body) {
  // naive implementation
  const re = /(!\[[^\]]*\]\()?(https?:\/\/.+\.(png|jpg|jpeg|gif))\)?/gm;
  return body.replace(re, '<img src="$2" style="max-width:100%;">');
}

function makeMarkdown(title, body, created) {
  const fixedTitle = fixTitleTag(title);
  const fixedBody = fixImageLinks(body);
  const _date = dateformat(created, 'yyyy-mm-dd hh:MM:ss +0000');
  return `---\nlayout: post\ntitle: ${fixedTitle}\ndate: ${_date}\n---\n\n${fixedBody}`;
}

module.exports = {
  makeMarkdown
};
