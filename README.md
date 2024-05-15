## Docker setup

### Build the docker image

`docker compose build`

### Run the docker container

#### In production

Would run:
`docker compose up`

Check the _deploy.sh_ file for a detailed look on what commands actually run.

#### Dev mode, using .env file and Cloud MongoDB

`docker run -e ".env" -p 3000:3000 uapvid:latest`
