import express from 'express'
import ServerConfig from '../../config.js'

let config = ServerConfig.ServerConfig;

export const route = express.Router();

/**
 * "GET /"
 * Exposes parts of the server config to the client that the client needs
 */
route.get('/', (req, res) => {
  res.contentType('application/javascript');
  return res.send("window.clientConfig = {firebaseBucketUri:'" + config.firebase.bucketUri + "', firebaseDatabaseId:'" + config.firebase.databaseId + "', imgurClientId:'" + config.imgur.clientId + "'}");
});

