# NGINX demo

docker build --no-cache -t nginx-demo .

docker build --no-cache -t nginx-demo:alpine -f Dockerfile.alpine .

docker images | grep nginx-demo

docker inspect nginx-demo | jq
docker history nginx-demo:latest
dive nginx-demo:latest

docker run -d -p 8080:80 --name nginx-demo nginx-demo
docker ps

curl http://localhost:8080

docker exec -ti nginx-demo bash
apt-get install procps net-tools
ps -ef
top
ls -al
exit

docker rm -f nginx-demo
