#!/usr/bin/make -f
.PHONY: all, build

export GPG_TTY := tty # GPG fix on Macos
export SHELL := bash

# HELP
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# And: https://gist.github.com/jed-frey/fcfb3adbf2e5ff70eae44b04d30640ad
help: ## 💡This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init: ## Clone all git submodules
	@echo "+ $@"
	@git submodule update --init --recursive
	@npm i

build: ## Local build with npm/typescript
	@echo "+ $@"
	@npm i
	@npm run prebuild
	@npm run prestart

start: ## Start with node
	@npm run start

up: ## Cloud start with okteto/npm
	@echo "+ $@"
	@okteto up --namespace develop

shell: ## Cloud shell with okteto
	@echo "+ $@"
	@okteto exec bash

docker-build: ## Build container docker
	@echo "+ $@"
