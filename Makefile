## ----------------------------------------------------------------------
## The purpose of this Makefile is to simplify common development tasks.
## ----------------------------------------------------------------------
##
## Usage:
##   - make up           : Build and run the application
##   - make build        : Build the application
##   - make server       : Run the server locally
##   - make web          : Run the web locally
##   - make dist         : Build the UI distribution and copy it to fs/dist
##   - make help         : Show available commands and descriptions
##

PROG = $(shell basename `git rev-parse --show-toplevel`)

.PHONY:up
up:
	make build
	
	@echo "Running the application..."
	./${PROG} 

.PHONY:build
build:
	make dist
	go build -o $(PROG)

.PHONY:server
server:
	go run .

.PHONY:web
web:
	npm run dev --prefix=web

.PHONY:dist
dist:
	npm run build --prefix=web
	cp -r web/dist/* internal/fs/dist

.PHONY:help
help:
	@sed -ne '/@sed/!s/##//p' $(MAKEFILE_LIST)