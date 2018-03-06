.PHONY: start
start: check-install ## (re)start all services
	@docker-compose up -d --force-recreate client

.PHONY: stop
stop: ## stop all containers
	@docker-compose down

.PHONY: server
server: ## attach to server log
	@echo "Attaching to server container…  (press \033[1;37mCTRL-C\033[0m to detach)"
	@docker attach --detach-keys="ctrl-c" brigidde_server || true

.PHONY: client
client: ## attach to client log
	@echo "Attaching to client container…  (press \033[1;37mCTRL-C\033[0m to detach)"
	@docker attach --detach-keys="ctrl-c" brigidde_client || true

.PHONY: shell
shell: ## open a shell in node container
	@docker-compose run --rm node sh -l

.PHONY: redis
redis: ## open a redis-cli shell
	@docker-compose exec redis redis-cli -h redis -a `cat .env | grep APP_REDIS_PASSWORD | sed 's/.*=\(\)/\1/'`

.PHONY: analyzer
analyzer: check-install_client ## start bundle analyzer service
	@docker-compose run --rm -w /project/client -p 9001:9001 node yarn analyzer || true

.PHONY: install
install: # install client and server node_modules
	@$(MAKE) install_server && $(MAKE) install_client

.PHONY: install_server
install_server: # install server node_modules
	@docker-compose run --rm -w /project/server node yarn

.PHONY: install_client
install_client: # install client node_modules
	@docker-compose run --rm -w /project/client node yarn

.PHONY: check-install
check-install: # shortcut for check-install_server and check-install_client
	@$(MAKE) check-install_server && $(MAKE) check-install_client

.PHONY: check-install_server
check-install_server: # install if node_modules doesn't exist or lockfile changed
	@if [ ! -d "server/node_modules" ] || ! cmp -s server/yarn.lock .make-yarn-state_server; then\
		$(MAKE) install_server && cp -pf server/yarn.lock .make-yarn-state_server;\
	fi

.PHONY: check-install_client
check-install_client: # install if node_modules doesn't exist or lockfile changed
	@if [ ! -d "client/node_modules" ] || ! cmp -s client/yarn.lock .make-yarn-state_client; then\
		$(MAKE) install_client && cp -pf client/yarn.lock .make-yarn-state_client;\
	fi

.DEFAULT_GOAL :=
.PHONY: help
help: # help text auto-generated from comments
	@echo "\nUsage: \033[1;37mmake <target>\033[0m\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
		'BEGIN {FS = ":.*?## "}; {printf "\033[0;36m%s\033[0m \033[0;37m→\033[0m %s\n", $$1, $$2}'
