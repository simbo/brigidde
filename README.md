brigidde
========

> Playground project. Something with angular client and hapi server.

---

<!-- TOC -->

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


## Features [WIP]


### Server

  - [x] oauth strategywith external providers
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


### General

  - [ ] store user/websocket relations in redis
  - [ ] persist chatbot conversations in couchdb
  - [ ] context/user related conversations for chatbot
  - [ ] client/ui implementation for signup/auth


## Development


### Requirements

`docker` with `docker-compose`


### Prerequisites

Install server and client dependencies:

``` sh
docker-compose run --rm server yarn
docker-compose run --rm client yarn
```

Create an env file, add your api tokens and customize it according your needs:

``` sh
cp .env-sample .env
```


### Usage

All services are managed via `docker-compose`.

``` sh
# start services in dependency order
docker-compose up -d
```

You can attach to running server or client container's tty to observe dev
tasks and logs:

``` sh
# attach to server
docker attach brigidde_server

# attach to client
docker attach brigidde_client
```

Use `ctrl-D,ctrl-Q` to detach from tty and keep the service running.  
(Using `ctrl-C` will detach and stop the service.)

For convenient package management using `yarn`, open a shell with client or
server container:

``` sh
# open shell with server container
docker-compose run --rm server sh -l

# open shell with client container
docker-compose run --rm client sh -l
```

For redis management, open a `redis-cli` shell using password from `.env`:

``` sh
# open redis-cli
docker-compose run --rm redis redis-cli -h redis -a <APP_REDIS_PASSWORD>
```


### URLs

…to use in your host machine browser, when services are running:

  - Webpack Dev Server (also proxy for server requests)  
    [localhost:9000](http://localhost:9000/)

  - CouchDB Fauxton  
    [localhost:5984/_utils](http://localhost:5984/_utils/)

  - Webpack bundle analyzer  
    (can be enabled in `./webpack/plugins.js` and started using
    `docker-compose run --rm -p 9001:9001 client yarn build`)
    [localhost:9001](http://localhost:9001)  
