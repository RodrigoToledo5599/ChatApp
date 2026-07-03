# CHAT APP

Esse projeto foi feito em Nestjs e Reactjs com node versão v24.14.0

## Requisitos:


### * Node v24.14.0
### * Docker


## Para rodar o projeto:

Tanto no front como no back renomeie os 2 {.env.example} para {.env}.
Já tem os valores corretos para rodar localmente.



### Infra opção 1: (Docker + Makefile)

```bash
    $ cd chat-app-back 
    $ npm i 
    $ cd ../docker 
    $ make do-it-all-db
```

### Infra opção 2: (Docker)

```bash
    $ cd docker
    $ docker compose up db -d
    $ docker compose up mongodb -d
    $ docker compose up redis -d
    $ cd ../chat-app-back
    $ npm i
    $ npm run prisma:postgres:generate
    $ npm run prisma:postgres:deploy
    $ npm run seed-postgres # opcional se vc quiser ter dados já inseridos para testar
```

### Front:
```bash
    $ cd chat-app-front
    $ npm i
    $ npm run dev
```
Abra a url: http://localhost:5173

