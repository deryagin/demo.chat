const fs = require('fs');
const url = require('url');

function application(req, res) {
  const urlParsed = url.parse(req.url);

  switch (urlParsed.pathname) {
    case '/chat':
      sendFile("client/chat.html", res);
      break;

    case '/chat.css':
      sendFile("client/chat.css", res);
      break;

    case '/chat.js':
      sendFile("client/chat.js", res);
      break;

    default:
      res.statusCode = 404;
      res.end("Not found");
  }
}

function sendFile(fileName, res) {
  // wtf();
  const fileStream = fs.createReadStream(fileName);
  fileStream
    .on('error', function () {
      res.statusCode = 500;
      res.end("Server error");
    })
    .pipe(res)
    .on('close', function () {
      fileStream.destroy();
    });
}

module.exports = application;
