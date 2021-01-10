#!/usr/bin/make -f
.PHONY: all, build

export GPG_TTY := tty # GPG fix on Macos
export SHELL := bash

# HELP
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# And: https://gist.github.com/jed-frey/fcfb3adbf2e5ff70eae44b04d30640ad
help: ## 💡This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init: ## Clone all git submodules and npm install
	@echo "+ $@"
	@git submodule update --init --recursive
	@npm i

build: ## Local build with npm/typescript
	@echo "+ $@"
	@npm i --also=dev
	@npm run build

test: ## Test all
	@echo "+ $@"
	@npm run lint
	@npm run coverage
	@echo "Test Dockerfile"
	@docker run --rm -i hadolint/hadolint < Dockerfile
	@make docker-build

start: ## Start with node
	@npm run start

dev: ## Start dev
	@echo "+ $@"
	@npm run dev

up: ## Cloud start with okteto/npm
	@echo "+ $@"
	@okteto up --namespace develop

shell: ## Cloud shell with okteto
	@echo "+ $@"
	@okteto exec bash

docker-build: ## 🐳 Build container docker
	@echo "+ $@"
	@docker-compose build

docker-run: ## 🐳 Run container locally
	@echo "+ $@"
	@docker-compose up

docker-logs: ##📝 See docker logs
	@echo "+ $@"
	@docker-compose logs --tail=200 -f

docker-shell: ## 💬 Get shell into container
	@echo "+ $@"
	@docker-compose exec client sh

deploy: ## ☸️ Apply kubernetes configs on all production namespace
	@echo "+ $@"
	@kubectl apply \
		--namespace develop \
		-f ./kube \
	&& kubectl apply \
		--namespace master \
		-f ./kube
