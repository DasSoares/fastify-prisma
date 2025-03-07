
# Fastify Prisma
Uma API de aprendizado juntando o framework nodejs Fastify e banco de dados Postgres com Prisma. Nesta API é utilizada o Swagger como documentação da API.

## Prisma
### Variáveis de ambiente
No arquivo `.env` adiciona a variável `DATABASE_URL` com o valor do banco de dados
exemplo `DATABASE_URL="postgresql://danilo:1234@localhost:5432/meubanco?schema=public"`

## Inicialização do banco
No prisma caso não tenha a pasta `prisma` rode o comando abaixo para iniciar a conexão com o banco e criar as migrates
> npx prisma init

Após isso, rode o comando para migrar os dados do arquivo `schema.prisma`, lembrando que neste arquivo você cria os modelos de tabelas
> npx prisma migrate dev
> npx prisma migrate dev --name init (não sei sobre, pesquisar depois)




my-fastify-app/
│
├── src/
│ ├── controllers/
│ │ └── exampleController.ts
│ ├── routes/
│ │ └── exampleRoutes.ts
│ ├── plugins/
│ │ └── examplePlugin.ts
│ ├── schemas/
│ │ └── exampleSchema.ts
│ ├── services/
│ │ └── exampleService.ts
│ ├── utils/
│ │ └── exampleUtil.ts
│ └── index.ts
│
├── test/
│ └── example.test.ts
│
├── package.json
├── tsconfig.json
└── README.md

Aqui está um breve resumo do propósito de cada pasta:

controllers: Contém a lógica dos controladores que processam as requisições e gerenciam as respostas.
routes: Define as rotas e associa cada rota ao controlador correspondente.
plugins: Contém plugins personalizados que podem ser registrados no Fastify.
schemas: Define os esquemas de validação das requisições e respostas usando JSON Schema.
services: Contém a lógica dos serviços que interagem com bancos de dados ou outras APIs externas.
utils: Contém utilitários e funções auxiliares usadas em diversas partes do projeto.
test: Contém os testes unitários e de integração.

Essa estrutura ajuda a manter o projeto organizado e facilita a manutenção e escalabilidade do código. Claro, essa é apenas uma sugestão de organização e você pode adaptá-la conforme as necessidades do seu projeto.
