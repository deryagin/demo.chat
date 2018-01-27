SHELL := /bin/bash

.DEFAULT_GOAL = dev.init

.PHONY: dev.hello
dev.hello:
	echo 'hello'

.PHONY: dev.server.start
dev.server.start:
	nodemon -x 'node' server/server.js

.PHONY: dev.server.debug
dev.server.debug:
	nodemon -x 'node --inspect' server/server.js

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint .

.PHONY: prod.install
prod.install:
	yarn install --prod

