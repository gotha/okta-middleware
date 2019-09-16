module.exports = cookieName => {
  return {
    get: req => req.signedCookies[cookieName],
    set: (res,value) => res.cookie(cookieName, value, {
      httpOnly: true,
      signed: true,
      maxAge: 300000
    })
  };
};
