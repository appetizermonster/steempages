'use strict';

const _ = require('lodash');
const fse = require('fs-extra');
const git = require('simple-git');

const fetcher = require('./fetcher');
const formatter = require('./formatter');
const postFilter = require('./post-filter');
const config = require('./config');

const githubUrl_re = /github\.com\/([^\/]+)\/(.+)/i;
const regexRet = githubUrl_re.exec(config.REPO_URL);
const username = regexRet[1];
const reponame = regexRet[2];
const repoUrl = `https://${username}:${config.API_TOKEN}@github.com/${username}/${reponame}.git`;

async function updateRepoWithSteemit() {
  if (!config.AUTHOR || config.AUTHOR.length <= 0) {
    console.log('please set author');
    process.exit(1);
  }

  await fse.remove('out');
  await fse.ensureDir('out');

  const repo = git('out');

  // checkout gh-pages
  console.log('cloning github repo...');
  await repo.clone(repoUrl, '.');
  await repo.pull();

  // fetch posts
  console.log('fetching posts from steemit...');

  if (config.DELETE_ALL_POSTS_BEFORE_BUILD)
    await fse.remove('out/_posts');
  await fse.ensureDir('out/_posts');

  const posts = await fetcher.fetchAllPosts(config.AUTHOR);
  let changed = false;
  for (const post of posts) {
    if (!postFilter.isOkay(post)) {
      console.log(`skipping ${post.permlink} becauseof filter`);
      continue;
    }

    const date = new Date(post.created);
    const dateStr = date.toISOString().replace(/T.+/i, '');
    const filename = `${dateStr}-${post.permlink}.md`;
    const filepath = `out/_posts/${filename}`;
    if (!config.OVERWRITE_POSTS && fse.existsSync(filepath)) {
      console.log(`skipping ${filepath}`);
      continue;
    }

    const fileContents = formatter.makeMarkdown(post.title, post.body, date);
    fse.writeFileSync(filepath, fileContents, {
      encoding: 'utf8'
    });
    console.log(`successfully wrote ${filepath}`);
    changed = true;
  }

  // commit changes
  if (!config.NO_PUSH && changed) {
    console.log('pushing the repo...');
    await repo.addConfig('user.name', 'steempages');
    await repo.addConfig('user.email', 'noemail');
    await repo.add('_posts');
    await repo.commit('Update posts by steempages');
    await repo.push('origin');
  } else {
    console.log('nothing has been changed');
  }
  console.log('done');
  process.exit(0);
}

updateRepoWithSteemit();
