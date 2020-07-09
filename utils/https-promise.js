const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          return resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        }

        const error = new Error('Request failed.');
        error.name = 'HTTPError';
        error.message = `status: ${res.statusCode}, body: ${data}`;

        return reject(error);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function post(url, headers, data) {
  const requestBody = JSON.stringify(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': requestBody.length,
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let response = '';

      // A chunk of data has been recieved.
      res.on('data', (chunk) => {
        response += chunk;
      });

      // The whole response has been received. Print out the result.
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          return resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: JSON.parse(response),
          });
        }

        const error = new Error('Request failed.');
        error.name = 'HTTPError';
        error.message = `status: ${res.statusCode}, body: ${response}`;

        return reject(error);
      });
    }).on('error', (err) => {
      reject(err);
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = {
  get,
  post,
};
