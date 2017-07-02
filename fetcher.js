'use strict';

const steem = require('steem');

function getDateForSteem() {
  return new Date().toISOString().replace('Z', '');
}

async function fetchAllPosts(author) {
  const limit = 10;
  const date = getDateForSteem();

  const permlinks = {};
  const results = [];
  let nextPermlink = null;
  while (true) {
    const posts = await steem.api.getDiscussionsByAuthorBeforeDate(author, nextPermlink, date, limit);
    const noMorePosts = (nextPermlink !== null && posts.length <= 1);
    if (noMorePosts)
      break;
    for (const post of posts) {
      const permlink = post.permlink;
      if (permlink in permlinks)
        continue;
      permlinks[permlink] = true;

      const metadata = JSON.parse(post.json_metadata);
      const result = {
        created: post.created,
        permlink: post.permlink,
        title: post.title,
        body: post.body,
        tags: metadata.tags
      };
      results.push(result);
    }
    nextPermlink = posts[posts.length - 1].permlink;
  }
  return results;
}

module.exports = {
  fetchAllPosts
};
