# DATABASE 
prisma-generate:
	cd ../chat-app-back && npm run prisma:postgres:generate

up-db:
# 	docker compose up db -d
	docker compose up mongodb -d

down-db:
# 	docker compose down db
	docker compose down mongodb

create-migrations:
	cd ../chat-app-back && npm run prisma:postgres:migrate

migrate-db:
	cd ../chat-app-back && npm run prisma:postgres:deploy

seed-db:
	cd ../chat-app-back && npm run seed-postgres

up-redis:
	docker compose up redis -d


do-it-all-db:
	@make up-redis
	@make up-db
	@make prisma-generate
	@make create-migrations
	@make migrate-db
	@make seed-db
