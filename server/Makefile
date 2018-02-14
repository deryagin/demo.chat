SHELL := /bin/bash

.DEFAULT_GOAL = dev.hello

.PHONY: dev.hello
dev.hello:
	echo 'hello'

.PHONY: dev.install
dev.install:
	yarn install

.PHONY: dev.start
dev.start:
	yarn run nodemon -x 'node' ./srv/server.js --config=./srv/config/devel.js

.PHONY: dev.debug
dev.debug:
	yarn run -s nodemon -x 'node --inspect' ./srv/server.js --config=./srv/config/devel.js | yarn run -s bunyan -o short

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint ./

.PHONY: prod.start
prod.start:
	node ./srv/server.js --config=./srv/config/prod.js
