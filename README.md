# NGINX demo

## Part 1 - Standalone Container

### Build a Docker image

```sh
docker build -t nginx-demo .
```

### Build a smaller Docker image (based on alpine line)

```sh
docker build -t nginx-demo:alpine -f Dockerfile.alpine .
```

### Check sizes of images built

```sh
docker images | grep nginx-demo
```

### Inspect the metadata and layers of the image(s)

```sh
docker inspect nginx-demo | jq
docker history nginx-demo:latest
```

### Start a container based on the image
docker run -d -p 8080:80 --name nginx-demo nginx-demo
docker ps

### Test the nginx web server is accessible via the host machine

```sh
curl http://localhost:8080
```

### Open an interactive bash terminal inside the container

```sh
docker exec -ti nginx-demo bash
```

### Install some tools to check processes running inside container

```sh
apt-get install -y procps net-tools
ps -ef
top
ls -al
exit
```

### Mounting a volume

```sh
docker run -d -p 8080:80 -v $(pwd)/web:/var/www/html:ro --name nginx-demo nginx-demo
```

### Remove the container

```sh
docker rm -f nginx-demo
```

## Part 2 - Multiple Containers

Create a user-defined network:

```sh
docker network create nginx-demo
```

Run a JSON API container:

```sh
docker run -d -p 8081:80 --network nginx-demo -v $(pwd)/api:/var/www/html:ro -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro --name nginx-api nginx-demo
```

```sh
curl -H "Accept: application/json" localhost:8081/countries.json | jq
```

Run the web client that fetches the JSON API data:

```sh
docker run -d -p 8080:80 --network nginx-demo -v $(pwd)/web2:/var/www/html:ro --name nginx-demo2 nginx-demo
```

From within the `nginx-web2` container, the api could be access using the `nginx-api` DNS name:

```sh
docker exec -ti nginx-demo2 bash
apt install curl -y
curl -H "Accept: application/json" http://nginx-api:8081/countries.json
```

### Remove the containers

```sh
docker rm -f nginx-api
docker rm -f nginx-demo2
```

### Use Docker Compose

```sh
docker-compose up
```

Access the websites:
- http://localhost:8080
- http://localhost:8082

Press CTRL+C to stop containers and exit Docker Compose.
