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

build-production: ## Builds production docker stack
	docker compose -f docker-compose.production.yml build

up-production: ## Brings production docker stack up
	docker compose -f docker-compose.production.yml up -d

down-production: ## Brings production docker stack down
	docker compose -f docker-compose.production.yml down

build-staging: ## Builds staging docker stack
	docker compose -f docker-compose.staging.yml build

up-staging: ## Brings staging docker stack up
	docker compose -f docker-compose.staging.yml up -d

down-staging: ## Brings staging docker stack down
	docker compose -f docker-compose.staging.yml down

node-sh: ## Opens shell inside running node container
	docker exec -it octo_node sh

postgres-sh: ## Opens shell inside running postgres container
	docker exec -it octo_postgres sh

db-clear: ## Clears all db data
	docker exec -it octo_node sh -c "npm run db:clear"

db-migrate: ## Runs db migrations
	docker exec -it octo_node sh -c "npm run db:migrate"

db-seed: ## Runs db seeders
	docker exec -it octo_node sh -c "npm run db:seed"

db-migrate-seed: ## Migrates data from old storage to the db
	docker exec -it octo_node sh -c "npm run migrate:seed"

redis-clear: ## Clears redis cache
	docker exec -it octo_node sh -c "npm run redis:clear"

format: ## Runs prettier
	docker exec -it octo_node sh -c "npm run format"

esbuild: ## Runs eslint
	docker exec -it octo_node sh -c "npm run esbuild"

lint: ## Runs eslint
	docker exec -it octo_node sh -c "npm run lint"

lint-fix: ## Runs eslint with fix
	docker exec -it octo_node sh -c "npm run lint:fix"

fix: ## Runs all auto fixes
	docker exec -it octo_node sh -c "npm run fix"

fix-staged: ## Runs all auto fixes
	docker exec octo_node sh -c "npm run fix:staged"

check: ## Runs all checks
	docker exec -it octo_node sh -c "npm run check"

test: ## Runs all tests
	docker exec -it octo_node sh -c "npm run test"

test-coverage: ## Runs all tests with coverage
	docker exec -it octo_node sh -c "npm run test:coverage"

test-ctrip: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-ctrip"

test-ctrip-coverage: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-ctrip:coverage"

test-redeam: ## Runs redeam tests
	docker exec -it octo_node sh -c "npm run test-redeam"

test-redeam-coverage: ## Runs redean tests
	docker exec -it octo_node sh -c "npm run test-redeam:coverage"
	
test-expedia: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-expedia"

test-expedia-coverage: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-expedia:coverage"

test-getyourguide: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-getyourguide"

test-getyourguide-coverage: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-getyourguide:coverage"

test-viator: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-viator"

test-viator-coverage: ## Runs ctrip tests
	docker exec -it octo_node sh -c "npm run test-viator:coverage"

console:
	docker exec -it octo_validator_node sh -c "npm run console $(filter-out $@,$(MAKECMDGOALS))"
