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
	yarn run nodemon -x 'node' ./server.js --config=./config/devel.js

.PHONY: dev.debug
dev.debug:
	yarn run -s nodemon -x 'node --inspect' ./server.js --config=./config/devel.js | yarn run -s bunyan -o short

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint ./

.PHONY: prod.start
prod.start:
	node ./server.js --config=./config/prod.js
