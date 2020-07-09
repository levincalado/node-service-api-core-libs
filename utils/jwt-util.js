const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

function verifyWithJWKS(token, jwksUri) {
  return new Promise((resolve, reject) => {
    const client = jwksClient({ jwksUri });

    function getKey(header, callback) {
      client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    jwt.verify(token, getKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      return resolve(decoded);
    });
  });
}

module.exports = {
  verifyWithJWKS,
  decodeJWT: (token) => jwt.decode(token),
};
