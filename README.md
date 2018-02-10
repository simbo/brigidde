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

You can manage the project using `docker-compose` as usual:

``` sh
docker-compose up -d
```

More convenient for development is opening separate container shells for client
and server to run and observe watch tasks and manage dependencies:

**Open server container shell (with couchdb and redis as dependencies):**

``` sh
docker-compose run --rm -p 3000:3000 server sh -l
# within the container, start the server in watch mode
yarn watch
```

**Open client container shell:**

``` sh
docker-compose run --rm client sh -l
# within the container, start webpack in watch mode
yarn watch
```

With running services, you can open **[localhost:3000](http://localhost:3000)**
in your host machine browser.

If you have enabled webpack bundle analyzer open [localhost:9000](http://localhost:9000)
for detailed bundle informations.
