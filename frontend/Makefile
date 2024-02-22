help: ## Prints help for targets with comments
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds docker stack
	mkdir -p node_modules
	docker compose -f docker-compose.yml build

up: ## Brings Docker stack up
	mkdir -p node_modules
	docker compose up -d -V --force-recreate

down: ## Brings Docker stack down
	docker compose down --remove-orphans