docker build . -t slowreverber
docker run -d --restart unless-stopped --env-file .env --name slowreverber slowreverber