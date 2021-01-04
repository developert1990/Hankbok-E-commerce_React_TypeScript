DOCKER_USERNAME := magicq6265
APP_NAME := hanbok_e_server
GIT_SHA := $(shell git rev-parse --short HEAD)
IMAGE := ${DOCKER_USERNAME}/${APP_NAME}:${GIT_SHA}

build-and-test: build test

build:
	@echo "Building image.."
	docker build --tag ${IMAGE} .
test:
	@echo "Testing app.."
	docker run --rm ${IMAGE} npm start
push:
	@echo "Pushing image to repository on docker hub.."
	docker push ${IMAGE}

.PHONY: build-and-test build test push