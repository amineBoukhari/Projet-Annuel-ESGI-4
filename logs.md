db-1  | fixing permissions on existing directory /var/lib/postgresql/data ... ok
db-1  | creating subdirectories ... ok
db-1  | selecting dynamic shared memory implementation ... posix
db-1  | selecting default max_connections ... 100
db-1  | selecting default shared_buffers ... 128MB
db-1  | selecting default time zone ... Etc/UTC
db-1  | creating configuration files ... ok
adminer-1  | [Sat May 30 16:21:09 2026] PHP 8.4.18 Development Server (http://[::]:8080) started
db-1       | running bootstrap script ... ok
db-1       | performing post-bootstrap initialization ... ok
db-1       | syncing data to disk ... ok
db-1       | 
db-1       | 
db-1       | Success. You can now start the database server using:
db-1       | 
db-1       |     pg_ctl -D /var/lib/postgresql/data -l logfile start
db-1       | 
db-1       | initdb: warning: enabling "trust" authentication for local connections
db-1       | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
db-1       | waiting for server to start....2026-05-30 16:21:10.546 UTC [48] LOG:  starting PostgreSQL 15.15 (Debian 15.15-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
db-1       | 2026-05-30 16:21:10.550 UTC [48] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db-1       | 2026-05-30 16:21:10.559 UTC [51] LOG:  database system was shut down at 2026-05-30 16:21:09 UTC
db-1       | 2026-05-30 16:21:10.565 UTC [48] LOG:  database system is ready to accept connections
db-1       |  done
db-1       | server started
db-1       | CREATE DATABASE
db-1       | 
db-1       | 
db-1       | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
db-1       | 
db-1       | 2026-05-30 16:21:10.730 UTC [48] LOG:  received fast shutdown request
db-1       | waiting for server to shut down....2026-05-30 16:21:10.731 UTC [48] LOG:  aborting any active transactions
db-1       | 2026-05-30 16:21:10.733 UTC [48] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
db-1       | 2026-05-30 16:21:10.733 UTC [49] LOG:  shutting down
db-1       | 2026-05-30 16:21:10.734 UTC [49] LOG:  checkpoint starting: shutdown immediate
db-1       | 2026-05-30 16:21:10.951 UTC [49] LOG:  checkpoint complete: wrote 922 buffers (5.6%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.019 s, sync=0.188 s, total=0.219 s; sync files=301, longest=0.003 s, average=0.001 s; distance=4239 kB, estimate=4239 kB
db-1       | 2026-05-30 16:21:10.959 UTC [48] LOG:  database system is shut down
db-1       |  done
db-1       | server stopped
db-1       | 
db-1       | PostgreSQL init process complete; ready for start up.
db-1       | 
db-1       | 2026-05-30 16:21:11.052 UTC [1] LOG:  starting PostgreSQL 15.15 (Debian 15.15-1.pgdg13+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
db-1       | 2026-05-30 16:21:11.052 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db-1       | 2026-05-30 16:21:11.052 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db-1       | 2026-05-30 16:21:11.056 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db-1       | 2026-05-30 16:21:11.061 UTC [64] LOG:  database system was shut down at 2026-05-30 16:21:10 UTC
db-1       | 2026-05-30 16:21:11.066 UTC [1] LOG:  database system is ready to accept connections
frontend-1  | 
frontend-1  | up to date, audited 180 packages in 1s
frontend-1  | 
frontend-1  | 39 packages are looking for funding
frontend-1  |   run `npm fund` for details
frontend-1  | 
frontend-1  | 5 vulnerabilities (2 moderate, 3 high)
frontend-1  | 
frontend-1  | To address all issues, run:
frontend-1  |   npm audit fix
frontend-1  | 
frontend-1  | Run `npm audit` for details.
frontend-1  | 
frontend-1  | > frontend@0.0.0 dev
frontend-1  | > vite --host
frontend-1  | 
backend-1   | 
backend-1   | removed 25 packages, and audited 235 packages in 1s
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
frontend-1  | 
frontend-1  |   VITE v7.3.1  ready in 289 ms
frontend-1  | 
frontend-1  |   ➜  Local:   http://localhost:5173/
frontend-1  |   ➜  Network: http://172.20.0.4:5173/
frontend-1  |   ➜  Network: http://172.19.0.2:5173/
backend-1   | [dotenv@17.2.4] injecting env (8) from .env -- tip: ⚙️  enable debug logging with { debug: true }
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
backend-1   | All models and associations were synchronized successfully.
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (description) passed to defaults option of findOrCreate
backend-1   | (sequelize) Warning: Unknown attributes (address) passed to defaults option of findOrCreate
backend-1   | Error starting server: ValidationError [SequelizeValidationError]: notNull Violation: Restaurant.adress cannot be null
backend-1   |     at InstanceValidator._validate (/app/node_modules/sequelize/lib/instance-validator.js:50:13)
backend-1   |     at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
backend-1   |     at async InstanceValidator._validateAndRunHooks (/app/node_modules/sequelize/lib/instance-validator.js:60:7)
backend-1   |     at async InstanceValidator.validate (/app/node_modules/sequelize/lib/instance-validator.js:54:12)
backend-1   |     at async model.save (/app/node_modules/sequelize/lib/model.js:2426:7)
backend-1   |     at async Restaurant.create (/app/node_modules/sequelize/lib/model.js:1362:12)
backend-1   |     at async Restaurant.findOrCreate (/app/node_modules/sequelize/lib/model.js:1422:25)
backend-1   |     at async seedRolesAndPermissions (/app/src/seed/rolesAndPermissions.seed.js:509:31)
backend-1   |     at async startServer (/app/server.js:80:7) {
backend-1   |   errors: [
backend-1   |     ValidationErrorItem {
backend-1   |       message: 'Restaurant.adress cannot be null',
backend-1   |       type: 'notNull Violation',
backend-1   |       path: 'adress',
backend-1   |       value: null,
backend-1   |       origin: 'CORE',
backend-1   |       instance: [Restaurant],
backend-1   |       validatorKey: 'is_null',
backend-1   |       validatorName: null,
backend-1   |       validatorArgs: []
backend-1   |     }
backend-1   |   ]
backend-1   | }
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
backend-1   | JWT_SECRET défini ? true
