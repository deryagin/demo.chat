// const fs = require('fs');
const _ = require('lodash');
const url = require('url');
const users = require('./entity/users');

function application(req, res) {
  const urlParsed = url.parse(req.url, true);

  switch (urlParsed.pathname) {
    case '/login':
      loginChat(urlParsed.query, res);
      break;

    default:
      res.statusCode = 404;
      res.end('Not found');
  }
}

function loginChat(query, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (query.nickname && !users.byNickname(query.nickname)) {
    let newcomer = users.add(query.nickname);
    return res.end(JSON.stringify(newcomer.public()));
  }

  res.statusCode = 400;
  return res.end(JSON.stringify({
    type: 'error',
    code: 'NICKNAME_ALREADY_TAKEN',
    message: `Failed to connect. Nickname "${query.nickname}" already taken.`,
  }));

}

module.exports = application;
