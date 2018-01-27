SHELL := /bin/bash

.DEFAULT_GOAL = dev.hello

.PHONY: dev.hello
dev.hello:
	echo 'hello'

.PHONY: dev.install
dev.install:
	yarn install

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint .

.PHONY: dev.server.start
dev.server.start:
	yarn run nodemon -x 'node' server/server.js

.PHONY: dev.server.debug
dev.server.debug:
	yarn run nodemon -x 'node --inspect' server/server.js

.PHONY: dev.client.start
dev.client.start:
	yarn run http-server ./client -p 8080 --cors='localhost'

.PHONY: prod.install
prod.install:
	yarn install --prod
