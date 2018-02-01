// const fs = require('fs');
const url = require('url');
const users = require('./users');

function application(req, res) {
  const urlParsed = url.parse(req.url, true);

  switch (urlParsed.pathname) {
    case '/login':
      loginChat(urlParsed.query, res);
      break;

    // case '/chat.css':
    //   sendFile("client/chat.css", res);
    //   break;

    // case '/chat.js':
    //   sendFile("client/chat.js", res);
    //   break;

    default:
      res.statusCode = 404;
      res.end('Not found');
  }
}

function loginChat(query, res) {
  // todo: add nickname validation, add json-api format
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (query.nickname && !users.byNickname(query.nickname)) {
    let newcomer = users.add(query.nickname);
    return res.end(JSON.stringify(newcomer));
  }

  return res.end(JSON.stringify({
    id: 'd9a53225-57e7-4e94-bed2-ed8dcfd91357',
    UTC: new Date().toISOString(),
    entity: 'message',
    type: 'system.error',
    data: {
      code: '123123',
      message: `Failed to connect. Nickname "${query.nickname}" already taken.`,
    }
  }))

  // todo: error handling
}

// function sendFile(fileName, res) {
//   // wtf();
//   const fileStream = fs.createReadStream(fileName);
//   fileStream
//     .on('error', function () {
//       res.statusCode = 500;
//       res.end("Server error");
//     })
//     .pipe(res)
//     .on('close', function () {
//       fileStream.destroy();
//     });
// }

module.exports = application;
