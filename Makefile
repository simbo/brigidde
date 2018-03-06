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
shell: ## open a node container shell
	@docker-compose run --rm node sh -l

.PHONY: redis
redis: ## open a redis-cli shell
	@docker-compose exec redis redis-cli -h redis -a `cat .env | grep APP_REDIS_PASSWORD | sed 's/.*=\(\)/\1/'`

.PHONY: analyzer
analyzer: check-install_client ## start bundle analyzer service at localhost:8081
	@docker-compose run --rm -p 8081:8081 node yarn analyzer || true

.PHONY: install
install: ## shortcut for install_server and install_client
	@$(MAKE) install_server && $(MAKE) install_client

.PHONY: install_server
install_server: ## install server node modules (automatically called if necessary)
	@docker-compose run --rm -w /project/server node yarn

.PHONY: install_client
install_client: ## install client node modules (automatically called if necessary)
	@docker-compose run --rm -w /project/client node yarn

.PHONY: remove
remove: ## shortcut for remove_server and remove_client
	@$(MAKE) remove_server && remove_client

.PHONY: remove_server
remove_server: ## remove server node_modules
	@rm -rf server/node_modules

.PHONY: remove_client
remove_client: ## remove client node_modules
	@rm -rf client/node_modules

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
	@echo "\nUsage: \033[1;37mmake <command>\033[0m\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk \
		'BEGIN {FS = ":.*?## "}; {printf "\033[0;36m%s\033[0m \033[0;37m→\033[0m %s\n", $$1, $$2}'
