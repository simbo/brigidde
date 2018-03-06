brigidde
========

  > A terminal-like progressive web app with angular client and hapi server.

---

<!-- TOC -->

- [Application goals [WIP]](#application-goals-wip)
- [Features [WIP]](#features-wip)
  - [Server](#server)
  - [Client](#client)
  - [General](#general)
- [Development](#development)
  - [Requirements](#requirements)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
  - [URLs](#urls)

<!-- /TOC -->

---

## Application goals [WIP]

  - [x] A terminal-like progressive web app.
  - [x] You can run commands.
  - [ ] You can interact with a human-like ai assistant.
  - [ ] You can authenticate and connect with other users.


## Features [WIP]


### Server

  - [x] oauth strategy with external providers
      - [x] store minimum user profiles with respective auth info
      - [x] support github oauth
      - [x] support twitter oauth
      - [ ] support facebook oauth
  - [ ] local user/password auth strategy
  - [x] jwt auth strategy
  - [x] websocket support
  - [x] couchdb integration using [nano](https://github.com/apache/couchdb-nano)
      - [x] automatic design updates
      - [x] generic database repository pattern
  - [x] redis integration
  - [x] static file serving using [inert](https://github.com/hapijs/inert)
  - [x] view management using [vision](https://github.com/hapijs/vision)
        with [pug](https://github.com/pugjs/pug) templates
      - [x] custom error views
  - [x] monitoring and logging using [good](https://github.com/hapijs/good)
        and [winston](https://github.com/winstonjs/winston)
  - [x] chatbot service
      - [x] [rivescript](https://www.rivescript.com/) integration 
      - [x] [wit.ai](https://wit.ai/) integration
  - [ ] interactive debugging console using [tv](https://github.com/hapijs/tv)
  - [ ] generated api documentation using [lout](https://github.com/hapijs/lout)
  - [ ] handle uncaught exceptions and cleanup afterwards using
        [poop](https://github.com/hapijs/poop)


### Client

  - [x] spa client using latest [angular](https://angular.io/)
  - [x] html templating using [pug](https://pugjs.org/)
  - [x] css development using [stylus](http://stylus-lang.com/) and [postcss](http://postcss.org/)
  - [x] convenient and state-of-the-art build system using [webpack](https://webpack.js.org/)
      - [x] deterministic chunk cache busting
      - [x] webpack dev server as proxy for app server
      - [x] hot module replacement in development


### General

  - [ ] store user/websocket relations in redis
  - [ ] persist chatbot conversations in couchdb
  - [ ] context/user related conversations for chatbot
  - [ ] client/ui implementation for signup/auth


## Development


### Requirements

`docker`, `docker-compose`, `make`


### Prerequisites

Create your custom `.env` with your settings, api keys and secrets.

Start off with a copy of `.env-sample`:  

``` sh
cp .env-sample .env
```


### Usage

There's a `Makefile` for common dev tasks.

You propably want to run `make start`.  
Dependencies should be installed automatically.

Run just `make` for usage information:

```
Usage: make <target>

start → (re)start all services
stop → stop all containers
server → attach to server log
client → attach to client log
shell → open a shell in node container
redis → open a redis-cli shell
analyzer → start bundle analyzer service
```


### URLs

…to use in your host machine, when services are running:

  - Webpack Dev Server (serves live-reloaded client with hmr support,
    proxy for api/socket calls to hapi server)  
    [localhost:9000](http://localhost:9000/)

  - Hapi Server (api and socket, serves static built client)  
    [localhost:3000](http://localhost:3000/)

  - CouchDB Fauxton  
    [localhost:5984/_utils](http://localhost:5984/_utils/)

  - Webpack bundle analyzer  
    [localhost:9001](http://localhost:9001)  
    (can be enabled in `./webpack/plugins.js` and started using
    `docker-compose run --rm -p 9001:9001 client yarn build`)
