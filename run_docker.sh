IMAGE=pokemon_task
NAME=pokemon_task

docker run -d --rm -p 3000:3000 --name $NAME $IMAGE
