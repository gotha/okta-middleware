const express = require('express');
const app = express();
const port = 3000;

const { clientId, clientSecret } = require('./credentials');

const s3omiddleware = require('@financial-times/okta-middleware')({
  clientId,
  clientSecret,
  appBaseURL: 'http://localhost:3000',
  organizationUrl: 'https://dev-122019.okta.com',
  cookieSecretKey: 'thisis32bitstringthatissecret123'
});
app.use(s3omiddleware.cookieParser);
app.use(s3omiddleware.cookieEncrypter);
app.use(s3omiddleware.router);
app.use(s3omiddleware.auth);

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/user', (req, res) => res.send(req.currentUser));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
