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
	yarn run nodemon -x 'node --inspect' ./server.js

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint ./
