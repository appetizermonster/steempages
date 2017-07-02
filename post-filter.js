'use strict';

const _ = require('lodash');
const config = require('./config');

function isOkay(post) {
  const isExcludedPermlink = _.indexOf(config.EXCLUDE_PERMLINKS, post.permlink) >= 0;
  if (isExcludedPermlink) {
    console.log(`${post.permlink} has excluded permlink`);
    return false;
  }
  const hasExcludedTag = _.intersection(config.EXCLUDE_TAGS, post.tags).length > 0;
  if (hasExcludedTag) {
    console.log(`${post.permlink} has excluded tag`);
    return false;
  }
  return true;
}

module.exports = {
  isOkay
};
