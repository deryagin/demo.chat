
# Full Stack Chat Task

Here will be node js developer test task. The task is to create a chat client and server application. Create separate projects for server and client, and submit your solution as GitHub repository links. Detailed requirements follow.

## Server
1. Broadcasts incoming messages to all connected clients (no rooms).
2. If a client is silent for more than a certain (configurable) amount of time, it is disconnected; a message about the event (e.g. "John was disconnected due to inactivity") is sent to all connected clients.
3. If a client is disconnected, but not due to inactivity, a different message is sent (e.g. "John left the chat, connection lost" instead.
4. Doesn't allow multiple users with the same nickname.
????5. Validates data received over the network.
6. Has logging.
7. Add opportunity to give a config file using cli options (e.g. node ./server.js --config=cfg/devel.js).
8. Terminates gracefully upon receiving SIGINT or SIGTERM signals.
9. Technology stack: Node.js (https://nodejs.org/dist/latestv6.x/docs/api/), ws (https://github.com/websockets/ws), Bunyan (https://github.com/trentm/nodebunyan), JSHint (copytheattached.jshintrcfileinto project root).

## Client
1. Has two pages landing page (shown when not connected to the server) and chat (shown only when connected to the server).
2. Landing page has a box to enter nickname, a button to connect and also displays feedback like 'Failed to connect. Nickname already taken.', 'Server unavailable.' or 'Disconnected by the server due to inactivity.'.
3. Should wait no longer than 3 seconds to establish a connection, and wait 5 seconds before trying to connect again.
4. Chat page displays messages from the server together with the sender's nickname (but no messages from before the user's current session started), a box to enter a message, a button to send it, and a button to disconnect from the server.
5. Does not have any inactivity timeouts.
6. Should display landing page if it's disconnected from the server.
7. Technology stack: builtin WebSocket API (https://developer.mozilla.org/enUS/docs/Web/API/WebSocket), AngularJS (https://docs.angularjs.org/guide), JSHint (takesomeoneelse's.jshintrc).

Todo:
[x] Без username + страница чата + простая рассылка сообшений.
[x] То же самое, но с использованием WS.
[x] Добавить AngularJS.
[x] Landing page + username (в том числе и в чате) + проверка уникальности username.
[x] Логирование
[x] Логика реконнекта на клиенте и на сервере.
[x] Обработка SIGINT or SIGTERM
[ ] Валидация сообщений.
[ ] Рефакторинг + Project's checklist, удалить debug-code.
[ ] Добавить autoscroll + убрать вертикальную и горизонтальную полосы прокрутки.
[ ] Добавить в server/Makefile для make prod.start запуск через pm2/forever.
[ ] How to reduce the number of the payload/* files?
