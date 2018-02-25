#!/bin/sh

# some color codes
cyan='\033[0;36m'
gray='\033[0;37m'
white='\033[1;37m'
none='\033[0m'

# command switch
case $1 in

  "init")
    if [ ! -f .env ]; then
      cp .env-sample .env
    fi
    docker-compose run --rm node sh -c "cd /project/server && yarn && cd /project/client && yarn"
  ;;

  "start")
    docker-compose up -d client
  ;;

  "stop")
    docker-compose down client server redis couchdb
  ;;

  "attach")
    container=$2
    docker attach --detach-keys="ctrl-c" brigidde_$container
  ;;

  "shell")
    docker-compose run --rm node sh -l
  ;;

  "redis")
    source .env
    docker-compose exec redis redis-cli -h redis -a $APP_REDIS_PASSWORD
  ;;

  "analyzer")
    docker-compose run --rm -p 9001:9001 node sh -l -c "cd /project/client; yarn analyzer"
  ;;

  "destroy")
    docker-compose down -v
  ;;

  # fallback output
  *)
    echo ""
    echo "Usage: ${white}./app <cmd> [<options>]${none}"
    echo ""
    echo "Available Commands:"
    echo "–––––––––––––––––––"
    echo "${cyan}init ${gray}→ initialize project and install dependencies${none}"
    echo "${cyan}start ${gray}→ start/restart services in development mode${none}"
    echo "${cyan}stop ${gray}→ stop services${none}"
    echo "${cyan}attach client ${gray}→ attach to client service (ctrl-c to detach)${none}"
    echo "${cyan}attach server ${gray}→ attach to server service (ctrl-c to detach)${none}"
    echo "${cyan}shell ${gray}→ open a node container shell${none}"
    echo "${cyan}redis ${gray}→ open a redis-cli shell${none}"
    echo "${cyan}analyzer ${gray}→ start webpack production build with bundle analyzer service${none}"
    echo "${cyan}build ${gray}→ build client for production${none}"
    echo "${cyan}destroy ${gray}→ destroy all containers and volumes${none}"
  ;;

esac
