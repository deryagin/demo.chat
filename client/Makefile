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
	yarn run http-server -c-1 -p 8080 --cors='localhost' ./

.PHONY: dev.codelint
dev.codelint:
	yarn run eslint ./
