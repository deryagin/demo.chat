var http = require('http');
var fs = require('fs');
var url = require('url');
var chat = require('./chat');

http.createServer(function (req, res) {
  var urlParsed = url.parse(req.url);

  switch (urlParsed.pathname) {
    case '/':
      sendFile("./index.html", res);
      break;

    case '/styles.css':
      sendFile("./styles.css", res);
      break;

    case '/login':
      chat.login(req, res);
      break;

    case '/send':
      var body = '';

      req
        .on('data', function (chunk) {
          body += chunk;

          if (body.length > 1e4) {
            res.statusCode = 413;
            res.end("Your message is too big for my little chat");
          }
        })
        .on('end', function () {
          try {
            console.log(body);
            body = JSON.parse(body);
          } catch (e) {
            res.statusCode = 400;
            res.end("Bad Request");
            return;
          }

          chat.send(body.message);
          res.end("ok");
        });

      break;

    default:
      res.statusCode = 404;
      res.end("Not found");
  }


}).listen(3000);


function sendFile(fileName, res) {
  var fileStream = fs.createReadStream(fileName);
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
