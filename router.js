const express = require('express');
const router = express.Router();

module.exports = ({
  handlers,
  loginUrl,
  loginCallbackUrl,
  logoutUrl,
  logoutCallbackUrl
}) => {
  const {
    login,
    loginCallback,
    logout,
    logoutCallback
  } = handlers;

  router.get(loginUrl, login);
  router.get(loginCallbackUrl, loginCallback);
  router.get(logoutUrl, logout);
  router.get(logoutCallbackUrl, logoutCallback);

  return router;
};
