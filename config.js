'use strict';

const fse = require('fs-extra');

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
if (fse.existsSync('./config.json')) {
  const configJson = require('./config.json');
  for (const key in config) {
    if (key in configJson)
      config[key] = configJson[key];
  }
}

module.exports = config;
