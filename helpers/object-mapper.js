const { ValidationError } = require('src/domain/error/errors').types;

const removeEmptyAttributes = (obj) => Object.keys(obj)
  .filter((k) => obj[k] != null) // Remove undef. and null.
  .reduce(
    (newObj, k) => (typeof obj[k] === 'object'
      ? { ...newObj, [k]: removeEmptyAttributes(obj[k]) } // Recurse.
      : { ...newObj, [k]: obj[k] }), // Copy value.
    {},
  );

function facebookToCognitoUser(obj) {
  return {
    ...obj,

    // rename attributes
    family_name: obj.last_name,
    given_name: obj.first_name,
    birthdate: obj.birthday,

    // remove renamed attributes
    last_name: undefined,
    first_name: undefined,
    birthday: undefined,
    id: undefined,
    ProviderType: undefined,
  };
}

function googleToCognitoUser(obj) {
  return {
    ...obj,

    // remove not needed attributes
    iss: undefined,
    azp: undefined,
    aud: undefined,
    sub: undefined,
    iat: undefined,
    exp: undefined,
    email_verified: undefined,
    ProviderType: undefined,
    hd: undefined,
    at_hash: undefined,
    nonce: undefined,
  };
}

function appleToCognitoUser(obj) {
  return {
    ...obj,

    // remove not needed attributes
    iss: undefined,
    aud: undefined,
    sub: undefined,
    iat: undefined,
    exp: undefined,
    c_hash: undefined,
    auth_time: undefined,
    nonce_supported: undefined,
    ProviderType: undefined,
    at_hash: undefined,
  };
}

function socialIdentityToCognitoUser(user) {
  let obj;

  switch (user.ProviderType) {
    case 'SignInWithApple':
      obj = appleToCognitoUser(user);
      break;
    case 'Facebook':
      obj = facebookToCognitoUser(user);
      break;
    case 'Google':
      obj = googleToCognitoUser(user);
      break;
    default:
      throw new this.utils.ErrorBuilder(ValidationError, 'Invalid/Unrecognized identityProvider');
  }

  obj.getAttributes = () => Object.keys(removeEmptyAttributes(obj))
    .map((name) => (name !== 'getAttributes'
      ? ({ Name: name, Value: obj[name] })
      : undefined)).filter((item) => !!item);

  return obj;
}

module.exports = {
  socialIdentityToCognitoUser,
};
