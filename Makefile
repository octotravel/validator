help: ## Prints help for targets with comments
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds docker stack
	cd backend && make build
	cd frontend && make build

up: ## Brings Docker stack up
	cd backend && make up
	cd frontend && make up

down: ## Brings Docker stack down
	cd backend && make down
	cd frontend && make down