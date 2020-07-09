const Crypto = require('crypto');
const uuidv4 = require('uuid').v4;

function filePartitionKey() {
  // get timestamp
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const partitionKey = `${year}${+month+1}${day}-${hour}${minutes}`;

  return partitionKey;
}

function timestamp() {
  // get timestamp
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const ts = `${year}${month}${day}${hour}${minutes}${seconds}`;

  return ts;
}

function hashKey(value, algorithm) {
  return Crypto.createHash(algorithm || 'SHA256')
    .update(`${new Date().getTime()}${value}`)
    .digest('hex');
}

module.exports = {
  hashKey,
  timestamp,
  filePartitionKey,
  uuidv4: () => uuidv4(),
};
