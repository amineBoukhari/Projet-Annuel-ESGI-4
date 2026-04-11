COMPOSE=docker compose -f docker-compose.yaml
EXEC_FRONT=$(COMPOSE) exec frontend
EXEC_BACK=$(COMPOSE) exec backend
start:
	docker kill $$(docker ps -q) || true
	$(COMPOSE) build --force-rm  
	$(COMPOSE) up -d --remove-orphans

logs:
	docker compose up --build 

front-bash:
	$(EXEC_FRONT) sh

back-bash:
	$(EXEC_BACK) sh