# Octo Validator

## Development

### Project setup
#### 1. Prepare .env files

- Copy `.env.local` as `.env`:
    - `cp backend/.env.local backend/.env`
    - `cp frontend/.env.local frontend/.env`

#### 2. Install and run build the containers

- Install Docker (https://docs.docker.com/get-docker/)
- Run `make build` command to build all docker containers

#### 3. Run all containers

- Run `make up` command and wait for `node_modules` installation

#### 4. Prepare database

- Run `cd backend && make console migrate-db`