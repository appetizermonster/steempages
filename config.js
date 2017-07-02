'use strict';

const fse = require('fs-extra');

function applyConfigFile(file) {
  if (!fse.existsSync(file))
    return;
  const configJson = require(file);
  for (const key in config) {
    if (key in configJson)
      config[key] = configJson[key];
  }
}

const config = {
  REPO_URL: null,
  API_TOKEN: '',
  DELETE_ALL_POSTS_BEFORE_BUILD: false,
  OVERWRITE_POSTS: false,
  NO_PUSH: false,

  EXCLUDE_TAGS: '',
  EXCLUDE_PERMLINKS: ''
};

// environment variables
const env = process.env;
for (const key in config) {
  if (key in env)
    config[key] = env[key];
}

// config.json
applyConfigFile('./config.json');
applyConfigFile('./config.public.json');

module.exports = config;
