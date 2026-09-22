# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

## Como usar este repositório

1. Clique em **"Use this template"** e crie **`pweb2-delivery-<matricula>`** (ex.: `pweb2-delivery-20231012345`).
   Este é o repositório que você usará o **semestre inteiro** (evolui a cada capítulo).
2. Clone, instale e rode:
   ```bash
   npm install
   npm start                                        # http://localhost:3000
   # em outro terminal — autograder:
   npm run check                                    # = BASE_URL=http://localhost:3000 node autograder/check.mjs
   ```
3. A cada `git push`, o **GitHub Actions** roda o autograder e mostra a nota na aba **Actions**
   (resumo do job). O `autograder/check.mjs` é **aberto** — leia para saber exatamente o que se espera.

## O que implementar (em `src/`)

```
src/
├── controllers/   # traduz HTTP ↔ service (sem regra de negócio)
├── services/      # TODA a regra de negócio
├── repositories/  # só acesso a dados
├── database/      # persistência SIMULADA em memória (sem banco real, sem ORM)
├── routes/        # composição das dependências (injeção) + monta em /api
└── utils/
```

- **Regra de negócio só no Service.** Injeção de dependência no **composition root** (`src/routes`).
- O `server.js` só configura o app (já traz o `GET /api/health` exigido — não remova).

## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

Faça **um commit por avanço** (Conventional Commits, ex.: `feat(entregas): valida origem ≠ destino`).
Bom trabalho! 🚀

---

## Documentação da API - Atividade 05 (Entregas)

Abaixo estão as instruções de execução e exemplos práticos de como testar as rotas implementadas nesta etapa utilizando o `curl`.

### Instruções de Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

   Inicie o servidor:
   ```bash
   npm start
   ```

   O servidor rodará na porta padrão 3000 ou na porta definida na variável de ambiente PORT.

### Exemplos de Requisição (cURL)

1. Criar uma nova entrega (POST /api/entregas)
```bash
   curl -X POST http://localhost:3000/api/entregas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Teclado Mecânico", "origem": "Maceió", "destino": "Recife"}'
```

2. Listar todas as entregas (GET /api/entregas)
```bash
   curl -X GET http://localhost:3000/api/entregas
```
3. Buscar entrega específica por ID (GET /api/entregas/:id)
```bash
   curl -X GET http://localhost:3000/api/entregas/1
```

4. Avançar o status da entrega (PATCH /api/entregas/:id/avancar)
```bash
   curl -X PATCH http://localhost:3000/api/entregas/1/avancar
```

5. Ver o histórico de eventos da entrega (GET /api/entregas/:id/historico)
```bash
   curl -X GET http://localhost:3000/api/entregas/1/historico
```

6. Cancelar uma entrega (PATCH /api/entregas/:id/cancelar)
```bash
   curl -X PATCH http://localhost:3000/api/entregas/1/cancelar
```

---

## Documentação da API - Atividade 06 (Motoristas e DI)

### Diagrama de Composição de Dependências (DI)

Abaixo está a representação da injeção de dependências realizada no Composition Root (`src/routes/index.js`):

```text
[ routes/index.js ] (Composition Root)
   │
   ├──> 1. Database (Instância em Memória)
   │
   ├──> 2. Repositories (Acesso a Dados via Contratos JSDoc)
   │      ├──> EntregasRepository (injeta: Database)
   │      └──> MotoristasRepository (injeta: Database)
   │
   ├──> 3. Services (Regras de Negócio)
   │      ├──> EntregasService (injeta: EntregasRepository, MotoristasRepository)
   │      └──> MotoristasService (injeta: MotoristasRepository, EntregasRepository)
   │
   └──> 4. Controllers (Tradução HTTP)
          ├──> EntregasController (injeta: EntregasService)
          └──> MotoristasController (injeta: MotoristasService)
```

### Novos Exemplos de Requisição (cURL)

7. Cadastrar Motorista (POST /api/motoristas)
```bash
   curl -X POST http://localhost:3000/api/motoristas \
   -H "Content-Type: application/json" \
   -d '{"nome": "João Silva", "cpf": "11122233344", "placaVeiculo": "ABC-1234"}'
```

8. Atribuir motorista a uma entrega (PATCH /api/entregas/:id/atribuir)
```bash
   curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
   -H "Content-Type: application/json" \
   -d '{"motoristaId": 1}'
```
9. Listar todos os motoristas (GET /api/motoristas)
```bash
   curl -X GET http://localhost:3000/api/motoristas
```
10. Buscar motorista por ID (GET /api/motoristas/:id)
```bash
   curl -X GET http://localhost:3000/api/motoristas/1
```
11. Listar entregas de um motorista (GET /api/motoristas/:id/entregas)
```bash
   curl -X GET http://localhost:3000/api/motoristas/1/entregas
```