.PHONY: run build regcmds

run:
	docker compose run node npm run start

build:
	docker compose run node npm run build

regcmds:
	docker compose run node npm run register-commands
