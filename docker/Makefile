# usa o Node do .nvmrc (o Prisma 7 não roda no Node 18 do sistema)
SHELL := /bin/bash
NODE = . $${NVM_DIR:-$$HOME/.nvm}/nvm.sh --no-use && nvm use --silent &&

# DATABASE 
prisma-generate:
	cd ../chat-app-back && $(NODE) npm run prisma:postgres:generate

up-db:
	docker compose up db -d
	docker compose up mongodb -d
	@until docker compose exec db pg_isready -U postgres -q; do sleep 1; done

down-db:
	docker compose down db
	docker compose down mongodb

create-migrations:
	cd ../chat-app-back && $(NODE) npm run prisma:postgres:migrate

migrate-db:
	cd ../chat-app-back && $(NODE) npm run prisma:postgres:deploy

seed-db:
	cd ../chat-app-back && $(NODE) npm run seed-postgres

up-redis:
	docker compose up redis -d

up-storage:
	docker compose up storage -d
	@until curl -s -o /dev/null localhost:9000; do sleep 1; done
	cd ../chat-app-back && $(NODE) npm run storage:setup


do-it-all-db:
	@make up-redis
	@make up-storage
	@make up-db
	@make prisma-generate
	@make create-migrations
	@make migrate-db
	@make seed-db
