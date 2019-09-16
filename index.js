const cookieParser = require('cookie-parser');
const cookieEncrypter = require('cookie-encrypter');

const Okta = require('./okta');
const Handlers = require('./handlers');
const Router = require('./router');
const Cookie = require('./cookie');
const { base64 } = require('./lib');

module.exports = ({
  clientId = false,
  clientSecret = false,
  appBaseURL = false,
  organizationUrl = false,
  loginUrl = '/login',
  loginCallbackUrl = '/authorization-code/callback',
  logoutUrl = '/logout',
  logoutCallbackUrl = '/logout/callback',
  cookieName = 'okta-login',
  cookieSecretKey = false
}) => {

  if (!clientId || !clientSecret || !appBaseURL || !organizationUrl || !cookieSecretKey) {
    throw 'You should provide cookieSecretKey, clientId, clientSecret, appBaseURL and organizationUrl options';
  }

  const okta = Okta(organizationUrl, clientId, clientSecret, `${appBaseURL}${loginCallbackUrl}`);
  const cookie = Cookie(cookieName);
  const handlers = Handlers({ okta, cookie });
  const router = Router({ handlers, loginUrl, loginCallbackUrl, logoutUrl, logoutCallbackUrl });

  const getUser = (req, res, next) => {
    const token = cookie.get(req);

    return okta.getUserInfo(token)
      .then(user => {
        req.currentUser = user;
        next();
      });
  };

  const auth = (req, res, next) => {
    return getUser(req, res, next)
      .catch(err => {
        console.log(err);
        const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        return res.redirect(`${loginUrl}?returnTo=${base64.encode(url)}`);
      });
  };

  const authNoRedirect = (req, res, next) => {
    return getUser(req, res, next)
      .catch(err => {
        console.log(err);

        return res.send('Forbidden');
      });
  };

  return {
    router,
    okta,
    cookie,
    auth,
    authNoRedirect,
    cookieEncrypter: cookieEncrypter(cookieSecretKey),
    cookieParser: cookieParser(cookieSecretKey)
  };
};
