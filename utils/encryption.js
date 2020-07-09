const crypto = require('crypto');

const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptionMethod = process.env.ENCRYPTION_METHOD || 'aes-256-cbc';
const encryptionIVLength = process.env.ENCRYPTION_IV_LENGTH
  ? Number.parseInt(process.env.ENCRYPTION_IV_LENGTH, 10) : 16;

function encrypt(text) {
  const iv = crypto.randomBytes(encryptionIVLength);

  // const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const cipher = crypto.createCipheriv(
    encryptionMethod,
    Buffer.from(encryptionKey),
    iv,
  );

  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  // const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  const decipher = crypto.createDecipheriv(
    encryptionMethod,
    Buffer.from(encryptionKey),
    iv,
  );

  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = {
  encrypt,
  decrypt,
};
