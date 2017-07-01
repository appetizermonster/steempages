'use strict';

const fse = require('fs-extra');
const git = require('simple-git');

const fetcher = require('./fetcher');
const formatter = require('./formatter');

let githubUrl = process.env.REPO_URL;
let token = process.env.API_TOKEN;

// check for config
if (fse.existsSync('./config.json')) {
  const config = require('./config.json');
  githubUrl = config.REPO_URL;
  token = config.API_TOKEN;
}

const githubUrl_re = /github\.com\/([^\/]+)\/(.+)/i;
const regexRet = githubUrl_re.exec(githubUrl);
const username = regexRet[1];
const reponame = regexRet[2];
const repoUrl = `https://${username}:${token}@github.com/${username}/${reponame}.git`;

async function updateRepoWithSteemit() {
  await fse.remove('out');
  await fse.ensureDir('out');

  const repo = git('out');

  // checkout gh-pages
  console.log('cloning github repo...');
  await repo.clone(repoUrl, '.');
  await repo.checkout('gh-pages');
  await repo.pull();

  // fetch posts
  console.log('fetching posts from steemit...');
  await fse.ensureDir('out/_posts');

  const posts = await fetcher.fetchAllPosts('heejin');
  let changed = false;
  for (const post of posts) {
    const date = new Date(post.created);
    const dateStr = date.toISOString().replace(/T.+/i, '');
    const filename = `${dateStr}-${post.permlink}.md`;
    const filepath = `out/_posts/${filename}`;
    if (fse.existsSync(filepath)) {
      console.log(`skipping ${filepath}`);
      continue;
    }

    const fileContents = formatter.makeMarkdown(post.title, post.body);
    fse.writeFileSync(filepath, fileContents, {
      encoding: 'utf8'
    });
    console.log(`successfully wrote ${filepath}`);
    changed = true;
  }

  // commit changes
  if (changed) {
    console.log('pushing the repo...');
    await repo.addConfig('user.name', 'steempages');
    await repo.addConfig('user.email', 'noemail');
    await repo.add('_posts/*');
    await repo.commit('Update posts by steempages');
    await repo.push('origin');
  } else {
    console.log('nothing has been changed');
  }
  console.log('done');
  process.exit(0);
}

updateRepoWithSteemit();
