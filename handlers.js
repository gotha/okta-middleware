const { base64 } = require('./lib');

module.exports = ({ okta, cookie }) => {

  const login = (req, res) => {
    const { returnTo } = req.query;
    const loginUrl = okta.getLoginUrl(returnTo, '@todo-nonce');

    return res.redirect(loginUrl);
  };

  const loginCallback = (req, res) => {
    const { code } = req.query;
    okta.getToken(code)
      .then(({ access_token }) => {
        cookie.set(res, access_token);

        return res.redirect(base64.decode(req.query.state));
      });
  };

  const logout = (req, res) => {
    /**
     * @todo
     */
    res.send('logout');
  };

  const logoutCallback = (req, res) => {
    /**
     * @todo
     */
    res.send('logoutCallback');
  };

  return {
    login,
    loginCallback,
    logout,
    logoutCallback
  };
};
