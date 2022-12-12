.PHONY: init build run regcmds

init:
	docker compose run --rm node npm install --verbose --save-dev \
    webpack webpack-cli typescript ts-loader ts-node nodemon-webpack-plugin

build:
	docker compose exec node npm run build

run:
	docker compose exec node node ./dist/main.cjs

regcmds:
	docker compose exec node node dist/register-commands.cjs
