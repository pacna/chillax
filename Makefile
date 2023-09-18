## ----------------------------------------------------------------------
## The purpose of this Makefile is to simplify common development tasks.
## ----------------------------------------------------------------------
##

PROG = $(shell basename `git rev-parse --show-toplevel`)

.PHONY:build
build: ## Build the application 
##
	make dist
	go build -o $(PROG)

.PHONY:server
server: ## Run the server locally
##
	go run .

.PHONY:web
web: ## Run the web locally
##
	npm run dev --prefix=web

.PHONY:dist
dist: ## Build the UI distribution and copy it to fs/dist
##
	npm run build --prefix=web
	cp -r web/dist/* internal/fs/dist

.PHONY:up
up: ## Build and run the application
##
	make build
	
	@echo "Running the application..."
	./${PROG} 

.PHONY:help
help: ## Show the help message with target descriptions
##
	@sed -ne '/@sed/!s/##//p' $(MAKEFILE_LIST)