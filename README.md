brigidde
========

> Something with angular client and hapi server.

---

<!-- TOC -->

- [Features [WIP]](#features-wip)
  - [Server](#server)
- [Development Usage](#development-usage)

<!-- /TOC -->

---

## Features [WIP]

### Server

  - [x] oauth strategy, signup using github or twitter
      - [ ] client/ui implementation
  - [x] jwt auth strategy
  - [x] websocket support
  - [x] couchdb integration using [nano](https://github.com/apache/couchdb-nano)
      - [x] automatic design updates
      - [x] generic database repository pattern
  - [x] redis integration
      - [ ] store user/websocket relations
  - [x] static file serving using [inert](https://github.com/hapijs/inert)
  - [x] view management using [vision](https://github.com/hapijs/vision)
        with [pug](https://github.com/pugjs/pug) templates
      - [x] custom error views
  - [x] monitoring and logging using [good](https://github.com/hapijs/good)
        and [winston](https://github.com/winstonjs/winston)
  - [x] chatbot service
      - [x] [rivescript](https://www.rivescript.com/) integration 
      - [x] [wit.ai](https://wit.ai/) integration
      - [ ] persist conversations
      - [ ] context/user related conversations
  - [ ] interactive debugging console using [tv](https://github.com/hapijs/tv)
  - [ ] generated api documentation using [lout](https://github.com/hapijs/lout)
  - [ ] handle uncaught exceptions and cleanup afterwards using
        [poop](https://github.com/hapijs/poop)


## Development Usage

**Requirements:** `docker` with `docker-compose`

Install dependencies:  
`docker-compose run --rm app yarn`

Copy env file and customize according your needs:  
`cp .env-sample .env`

Ready to use docker-compose services.  
i.e.: `docker-compose up -d`

If you need a container shell:  
`docker-compose run --rm app sh -l`
