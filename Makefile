SHELL := /bin/bash

.DEFAULT_GOAL = dev.hello

# general targets

.PHONY: dev.hello
dev.hello:
	echo 'hello'

.PHONY: dev.install
dev.install:
	yarn install

# server targets

.PHONY: dev.server.start
dev.server.start:
	yarn run nodemon -x 'node --inspect' server/server.js

.PHONY: dev.server.codelint
dev.server.codelint:
	yarn run eslint ./server

# client targets

.PHONY: dev.client.start
dev.client.start:
	yarn run http-server -c-1 -p 8080 --cors='localhost' ./client

.PHONY: dev.client.codelint
dev.client.codelint:
	yarn run eslint ./client

# production targets

.PHONY: prod.install
prod.install:
	yarn install --prod
