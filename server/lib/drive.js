import Bluebird from 'bluebird';
import { google } from 'googleapis';
import is  from '@sindresorhus/is'

const Promise = Bluebird

const drive = google.drive('v3');
const mimeType = 'application/json';

export const create = (auth, fileName, data) => {
  return Promise
    .fromCallback(cb => drive.files.create({
      resource: {
        name: fileName,
        parents: ['appDataFolder'],
      },
      media: {
        mimeType,
        body: JSON.stringify(data),
      },
      auth,
    }, cb))
    .then(res => res.data);
};

export const list = (auth) => {
  return Promise
    .fromCallback(cb => drive.files.list({
      q: `mimeType="${mimeType}"`,
      spaces: 'appDataFolder',
      auth,
    }, cb))
    .then(res => res.data.files);
};

export const get = (auth, fileId) => {
  return Promise
    .fromCallback(cb => drive.files.get({
      fileId,
      alt: 'media',
      auth,
    }, cb))
    .then(res => res.data);
};

export const update = (auth, fileId, data) => {
  return Promise
    .fromCallback(cb => drive.files.update({
      fileId,
      media: {
        mimeType,
        body: JSON.stringify(data),
      },
      auth,
    }, cb))
    .then(res => res.data);
};

/**
 * @summary Read a JSON file on gDrive
 * @param {OAuht2} auth - OAuth2 Client
 * @param {string} fileName
 * @param {any} emptyValue
 * @returns {Promise<any>}
 */
export const readJson = async (auth, fileName, emptyValue) => {
  const files = await list(auth);

  if (files.length === 0) {
    return emptyValue;
  }

  const file = files.find(item => item.name === fileName);
  if (!file) {
    return emptyValue;
  }

  const content = await get(auth, file.id);
  if (is.string(content)) {
    return JSON.parse(content);
  }

  return content;
};

/**
 * @summary Write a JSON file on gDrive
 * @param {OAuth2} auth - OAuth2 Client
 * @param {string} fileName
 * @param {any} data
 * @returns {Promise<any>}
 */
export const writeJson = async (auth, fileName, data) => {
  const files = await list(auth);

  if (files.length === 0) {
    return create(auth, fileName, data);
  }

  
  const file = files.find(item => item.name === fileName);
 
  if (!file) {
    return create(auth, fileName, data);
  }

  return update(auth, file.id, data);
};

export default { readJson, writeJson, update, get, create, list };
