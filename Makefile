## ----------------------------------------------------------------------
## The purpose of this Makefile is to simplify common development tasks.
## ----------------------------------------------------------------------
##

.PHONY:dist
dist: ## build ui dist and paste it to fs/dist
##
	npm run build --prefix=web
	cp -r web/dist/* internal/fs/dist

.PHONY:help
help: ## Show this help.
##
	@sed -ne '/@sed/!s/##//p' $(MAKEFILE_LIST)