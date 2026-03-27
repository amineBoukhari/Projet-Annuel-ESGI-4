COMPOSE=docker compose -f docker-compose.yaml
EXEC_FRONT=$(COMPOSE) exec frontend
EXEC_BACK=$(COMPOSE) exec backend
start:
	docker compose up -d --build 

logs:
	docker compose up --build 

front-bash:
	$(EXEC_FRONT) sh

back-bash:
	$(EXEC_BACK) sh