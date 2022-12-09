.PHONY: init build run

init:
	docker compose run --rm node npm install --verbose --save-dev \
    webpack webpack-cli typescript ts-loader ts-node nodemon-webpack-plugin

build:
	docker compose exec node npm run build

run:
	docker compose exec node node ./dist/main.cjs
