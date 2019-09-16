const base64 = {
  decode: string => Buffer.from(string, 'base64').toString(),
  encode: string => Buffer.from(string).toString('base64')
};

module.exports = {
  base64
};
