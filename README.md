## Proyecto de la UAP
To do:
- [] Descripción de la arquitectura el proyecto
  - [] Explicación de la estructura de archivos y carpetas
  - [] Diagrama de despliegue
## Docker setup

### Build the docker image

`docker build -t uap:latest .`

### Run the docker container

#### In production

Would run:
`docker-compose up -d --name uap`
Check the _deploy.sh_ file.

#### In development mode, passing .env file to use Cloud MongoDB

`docker run -e ".env" -p 3000:3000 uap:latest`
