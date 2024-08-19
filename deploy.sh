# Delete old code
rm -rf uap-vid
# clone latest code
git clone https://github.com/bojkomatias/uap-vid.git

cd uap-vid
git checkout testing_environment

cp /home/nodo/apps/enviroments/uap-vid.env ./.env
cat .env

# docker compose up with name uap 
docker-compose up -d --no-deps --force-recreate uap-research

