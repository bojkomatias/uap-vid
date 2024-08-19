
# Delete old code
rm -rf uap-vid

# clone latest code
git clone https://github.com/bojkomatias/uap-vid.git

# go to uap-vid folder
cd uap-vid

# build docker image
docker build -t uap:latest .

# # docker compose down
# docker-compose down

# docker compose up with name uap 
docker-compose up -d --no-deps --force-recreate uap-research