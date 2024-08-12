# Delete old code
rm -rf uap-vid
# clone latest code
git clone https://github.com/bojkomatias/uap-vid.git

cd uap-vid
git checkout testing_environment

cp /home/nodo/apps/enviroments/uap-vid.env ./.env
cat .env


#docker compose down�
docker compose -f mongodb-compose.yml up

#docker-compose -f uap-research-compose.yml up