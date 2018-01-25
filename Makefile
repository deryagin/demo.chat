SHELL := /bin/bash

.DEFAULT_GOAL = dev.init

.PHONY: dev.hello
dev.hello:
	echo 'hello'

.PHONY: dev.init
dev.init:
	make dev.install && make dev.setup

.PHONY: dev.install
dev.install:
	yarn install

.PHONY: dev.setup
dev.setup:
	sh ./bin/db.setup.sh

.PHONY: dev.start
dev.start:
	nodemon -x 'node' srv/server.js

.PHONY: dev.debug
dev.debug:
	nodemon -x 'node --inspect' srv/server.js

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint .

.PHONY: prod.install
prod.install:
	yarn install --prod

