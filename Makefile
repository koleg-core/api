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

build: ## Local build with npm/typescript
	@echo "+ $@"

start: ## Cloud start with okteto/npm
	@echo "+ $@"
	@okteto up


docker-build: ## Build container docker
	@echo "+ $@"
