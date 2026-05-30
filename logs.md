 | 2026-05-30 16:19:27.991 UTC [1] LOG:  database system is ready to accept connections
backend-1   | 
backend-1   | removed 25 packages, and audited 235 packages in 2s
backend-1   | 
backend-1   | 38 packages are looking for funding
backend-1   |   run `npm fund` for details
backend-1   | 
backend-1   | 17 vulnerabilities (2 low, 5 moderate, 10 high)
backend-1   | 
backend-1   | To address issues that do not require attention, run:
backend-1   |   npm audit fix
backend-1   | 
backend-1   | To address all issues (including breaking changes), run:
backend-1   |   npm audit fix --force
backend-1   | 
backend-1   | Run `npm audit` for details.
backend-1   | [nodemon] 3.1.14
backend-1   | [nodemon] to restart at any time, enter `rs`
backend-1   | [nodemon] watching path(s): *.*
backend-1   | [nodemon] watching extensions: js,mjs,cjs,json
backend-1   | [nodemon] starting `node server.js`
backend-1   | [dotenv@17.2.4] injecting env (8) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
backend-1   | Auth middleware loaded
backend-1   | Setting up associations for model: User
backend-1   | Associating model: User
backend-1   | Setting up associations for model: Restaurant
backend-1   | Associating model: Restaurant
backend-1   | Setting up associations for model: Role
backend-1   | Associating model: Role
backend-1   | Setting up associations for model: Ingredient
backend-1   | Associating model: Ingredient
backend-1   | Setting up associations for model: StockMovement
backend-1   | Associating model: StockMovement
backend-1   | Setting up associations for model: Recipe
backend-1   | Associating model: Recipe
backend-1   | Setting up associations for model: RecipeIngredient
backend-1   | Setting up associations for model: RolePermission
backend-1   | Associating model: RolePermission
backend-1   | Setting up associations for model: Permission
backend-1   | Associating model: Permission
backend-1   | Setting up associations for model: Supplier
backend-1   | Associating model: Supplier
backend-1   | Setting up associations for model: PurchaseOrder
backend-1   | Associating model: PurchaseOrder
backend-1   | Setting up associations for model: PurchaseOrderItem
backend-1   | Associating model: PurchaseOrderItem
backend-1   | Setting up associations for model: PurchaseReturn
backend-1   | Associating model: PurchaseReturn
backend-1   | Setting up associations for model: PurchaseReturnItem
backend-1   | Associating model: PurchaseReturnItem
backend-1   | Setting up associations for model: Payment
backend-1   | Associating model: Payment
backend-1   | Setting up associations for model: Invoice
backend-1   | Associating model: Invoice
backend-1   | Setting up associations for model: InvoiceItem
backend-1   | Associating model: InvoiceItem
backend-1   | Setting up associations for model: Expense
backend-1   | Associating model: Expense
backend-1   | Example app listening on port: http://localhost:3000
backend-1   | Connection has been established successfully.
db-1        | 2026-05-30 16:19:29.219 UTC [69] ERROR:  foreign key constraint "InvoiceItems_recipeId_fkey" cannot be implemented
db-1        | 2026-05-30 16:19:29.219 UTC [69] DETAIL:  Key columns "recipeId" and "id" are of incompatible types: uuid and integer.
db-1        | 2026-05-30 16:19:29.219 UTC [69] STATEMENT:  CREATE TABLE IF NOT EXISTS "InvoiceItems" ("id" UUID , "invoiceId" UUID NOT NULL REFERENCES "Invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "description" VARCHAR(255) NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 1, "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "recipeId" UUID REFERENCES "Recipes" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));
backend-1   | Error starting server: Error
backend-1   |     at Query.run (/app/node_modules/sequelize/lib/dialects/postgres/query.js:50:25)
backend-1   |     at /app/node_modules/sequelize/lib/sequelize.js:315:28
backend-1   |     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
backend-1   |     at async PostgresQueryInterface.createTable (/app/node_modules/sequelize/lib/dialects/abstract/query-interface.js:98:12)
backend-1   |     at async InvoiceItem.sync (/app/node_modules/sequelize/lib/model.js:942:7)
backend-1   |     at async Sequelize.sync (/app/node_modules/sequelize/lib/sequelize.js:377:9)
backend-1   |     at async startServer (/app/server.js:74:7) {
backend-1   |   name: 'SequelizeDatabaseError',
backend-1   |   parent: error: foreign key constraint "InvoiceItems_recipeId_fkey" cannot be implemented
backend-1   |       at parseErrorMessage (/app/node_modules/pg-protocol/dist/parser.js:305:11)
backend-1   |       at Parser.handlePacket (/app/node_modules/pg-protocol/dist/parser.js:143:27)
backend-1   |       at Parser.parse (/app/node_modules/pg-protocol/dist/parser.js:37:38)
backend-1   |       at Socket.<anonymous> (/app/node_modules/pg-protocol/dist/index.js:11:42)
backend-1   |       at Socket.emit (node:events:509:28)
backend-1   |       at addChunk (node:internal/streams/readable:563:12)
backend-1   |       at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
backend-1   |       at Readable.push (node:internal/streams/readable:394:5)
backend-1   |       at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
backend-1   |     length: 225,
backend-1   |     severity: 'ERROR',
backend-1   |     code: '42804',
backend-1   |     detail: 'Key columns "recipeId" and "id" are of incompatible types: uuid and integer.',
backend-1   |     hint: undefined,
backend-1   |     position: undefined,
backend-1   |     internalPosition: undefined,
backend-1   |     internalQuery: undefined,
backend-1   |     where: undefined,
backend-1   |     schema: undefined,
backend-1   |     table: undefined,
backend-1   |     column: undefined,
backend-1   |     dataType: undefined,
backend-1   |     constraint: undefined,
backend-1   |     file: 'tablecmds.c',
backend-1   |     line: '9489',
backend-1   |     routine: 'ATAddForeignKeyConstraint',
backend-1   |     sql: 'CREATE TABLE IF NOT EXISTS "InvoiceItems" ("id" UUID , "invoiceId" UUID NOT NULL REFERENCES "Invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "description" VARCHAR(255) NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 1, "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "recipeId" UUID REFERENCES "Recipes" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));',
backend-1   |     parameters: undefined
backend-1   |   },
backend-1   |   original: error: foreign key constraint "InvoiceItems_recipeId_fkey" cannot be implemented
backend-1   |       at parseErrorMessage (/app/node_modules/pg-protocol/dist/parser.js:305:11)
backend-1   |       at Parser.handlePacket (/app/node_modules/pg-protocol/dist/parser.js:143:27)
backend-1   |       at Parser.parse (/app/node_modules/pg-protocol/dist/parser.js:37:38)
backend-1   |       at Socket.<anonymous> (/app/node_modules/pg-protocol/dist/index.js:11:42)
backend-1   |       at Socket.emit (node:events:509:28)
backend-1   |       at addChunk (node:internal/streams/readable:563:12)
backend-1   |       at readableAddChunkPushByteMode (node:internal/streams/readable:514:3)
backend-1   |       at Readable.push (node:internal/streams/readable:394:5)
backend-1   |       at TCP.onStreamRead (node:internal/stream_base_commons:189:23) {
backend-1   |     length: 225,
backend-1   |     severity: 'ERROR',
backend-1   |     code: '42804',
backend-1   |     detail: 'Key columns "recipeId" and "id" are of incompatible types: uuid and integer.',
backend-1   |     hint: undefined,
backend-1   |     position: undefined,
backend-1   |     internalPosition: undefined,
backend-1   |     internalQuery: undefined,
backend-1   |     where: undefined,
backend-1   |     schema: undefined,
backend-1   |     table: undefined,
backend-1   |     column: undefined,
backend-1   |     dataType: undefined,
backend-1   |     constraint: undefined,
backend-1   |     file: 'tablecmds.c',
backend-1   |     line: '9489',
backend-1   |     routine: 'ATAddForeignKeyConstraint',
backend-1   |     sql: 'CREATE TABLE IF NOT EXISTS "InvoiceItems" ("id" UUID , "invoiceId" UUID NOT NULL REFERENCES "Invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "description" VARCHAR(255) NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 1, "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "recipeId" UUID REFERENCES "Recipes" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));',
backend-1   |     parameters: undefined
backend-1   |   },
backend-1   |   sql: 'CREATE TABLE IF NOT EXISTS "InvoiceItems" ("id" UUID , "invoiceId" UUID NOT NULL REFERENCES "Invoices" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "description" VARCHAR(255) NOT NULL, "quantity" INTEGER NOT NULL DEFAULT 1, "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0, "recipeId" UUID REFERENCES "Recipes" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));',
backend-1   |   parameters: {}
backend-1   | }
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true

