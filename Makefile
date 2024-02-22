help: ## Prints help for targets with comments
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds docker stack
	mkdir -p backend/node_modules
	docker compose -f backend/docker-compose.yml build
	mkdir -p frontend/node_modules
	docker compose -f frontend/docker-compose.yml build

up: ## Brings Docker stack up
	mkdir -p backend/node_modules
	docker compose -f backend/docker-compose.yml up -d -V --force-recreate
	mkdir -p frontend/node_modules
	docker compose -f frontend/docker-compose.yml up -d -V --force-recreate

down: ## Brings Docker stack down
	docker compose -f backend/docker-compose.yml down --remove-orphans
	docker compose -f frontend/docker-compose.yml down --remove-orphans