const axios = require('axios');
const { base64 } = require('./lib');

const createQueryParams = params =>
  Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

module.exports = (organizationUrl, clientId, clientSecret, redirectUrl) => {
  return {
    getLoginUrl: (state, nonce) => {
      const params = {
        client_id: clientId,
        response_type: 'code',
        response_mode: 'query',
        scope: 'openid profile',
        redirect_uri: redirectUrl,
        state,
        nonce
      };

      return `${organizationUrl}/oauth2/default/v1/authorize?${createQueryParams(params)}`;
    },
    getToken: code => {
      const params = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUrl
      };
      const authHeader = base64.encode(`${clientId}:${clientSecret}`);
      const headers = {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Connection: 'close',
        'Content-Length': 0
      };
      const url = `${organizationUrl}/oauth2/default/v1/token?${createQueryParams(params)}`;

      return axios.post(url, {}, { headers }).then(response => response.data);
    },
    getUserInfo: accessToken => {
      return axios.get(`${organizationUrl}/oauth2/default/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => response.data);
    }
  };
};
