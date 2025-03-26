
# Fastify Prisma
Uma API de aprendizado juntando o framework nodejs Fastify e banco de dados Postgres com Prisma. Nesta API é utilizada o Swagger como documentação da API.

### Arquitetura de pastas
```
📦 fastify-prisma           # Nome do projeto
├── 📁 src                  
│   ├── 📁 controllers      # Controladores para gerenciar a lógica das rotas
│   ├── 📁 routes           # Definição das rotas da aplicação
│   ├── 📁 schemas          # Schemas de Requests ou Response para Swagger UI
│   ├── 📁 services         # Serviços para regras de negócio e lógica de aplicação
│   ├── 📁 utils            # Funções utilitárias e helpers
├── 📁 tests                # Testes unitários e de integração
├── .env                    # Arquivo de variáveis de ambiente
├── .gitignore              # Arquivo para ignorar arquivos no Git
├── index.ts                # Arquivo de inicialização do servidor
├── package.json            # Configuração do projeto e dependências
└── README.md               # Documentação do projeto
```

## Prisma
### Variáveis de ambiente
No arquivo `.env` adiciona a variável `DATABASE_URL` com o valor do banco de dados
exemplo `DATABASE_URL="postgresql://user:pass@localhost:5432/db_name?schema=public"`

## Inicialização do banco
No prisma caso não tenha a pasta `prisma` rode o comando abaixo para iniciar a conexão com o banco e criar as migrates
> npx prisma init

Após isso, rode o comando para migrar os dados do arquivo `schema.prisma`, lembrando que neste arquivo você cria os modelos de tabelas
> npx prisma migrate dev
> npx prisma migrate dev --name init (não sei sobre, pesquisar depois)


## Inicializaão do Redis
Tente não iniciar o redis no docker dashboard, pois pode não conseguir conectar a ele, use o seguinte comando abaixo
> docker run --name redis-container -d -p 6379:6379 redis



