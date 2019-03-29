# NGINX demo

### Build a Docker image

```sh
docker build --no-cache -t nginx-demo .
```

### Build a smaller Docker image (based on alpine line)

```sh
docker build --no-cache -t nginx-demo:alpine -f Dockerfile.alpine .
```

### Check sizes of images built

```sh
docker images | grep nginx-demo
```

### Inspect the metadata and layers of the image(s)

```sh
docker inspect nginx-demo | jq
docker history nginx-demo:latest
dive nginx-demo:latest
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
apt-get install procps net-tools
ps -ef
top
ls -al
exit
```

### Remove the container

```sh
docker rm -f nginx-demo
```

### Resources

* [Dive](https://github.com/wagoodman/dive) - A tool for exploring each layer in a docker image