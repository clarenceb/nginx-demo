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
exit
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

## Kubernetes

### Prerequisites

* Kubernetes cluster
* `kubectl` installed and configured to access your Kubernetes cluster

If you need a cluster you can use [Minikube](https://minikube.sigs.k8s.io/) or create one on [Azure with AKS](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough).

### Publish Docker image (if using DockerHub)

To Docker Hub (use your Docker login and repository name):

```sh
docker login
docker tag nginx-demo clarenceb/nginx-demo
docker push clarenceb/nginx-demo
```

### Publish Docker image (if using ACR with AKS)

To Azure Container Registry:

```sh
az group create --name myacr --location australiaeast
az acr create --resource-group myacr --name <myacr-unique-name> --sku Basic
az acr login --name <myacr-unique-name>
docker tag nginx-demo <myacr-unique-name>.azurecr.io/nginx-demo
docker push <myacr-unique-name>.azurecr.io/nginx-demo
```

Grant access to your AKS cluster to pull images form ACR:

```sh
ACR_ID=$(az acr show -n <myacr-unique-name> --query id -o tsv)
az aks update -n <aks-cluster-name> -g <aks-resource-group> --attach-acr $ACR_ID
```

### Pods

```sh
kubectl run nginx-demo --image=<myacr-unique-name>.azurecr.io/nginx-demo --generator=run-pod/v1 --port=8080
kubectl get pod
kubectl describe pod/nginx-demo
```

Port forward to access the pod from localhost:

```sh
kubectl port-forward pod/nginx-demo 8080:80
```

Cleanup:

```sh
kubectl delete pod/nginx-demo
```

With a Kubernetes Manifest:

```sh
kubectl apply -f kubernetes/pod.yaml
kubectl get pod
kubectl describe pod/nginx-demo
kubectl port-forward pod/nginx-demo 8080:80
kubectl delete pod/nginx-demo
```

### Relica Sets

"A ReplicaSet’s purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods." - [Source](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/).


With a Kubernetes Manifest:

```sh
kubectl apply -f kubernetes/replica-set.yaml
kubectl get rs
kubectl get pod
kubectl describe rs/nginx-demo-rs
kubectl port-forward rs/nginx-demo-rs 8080:80

# Try killing a pod, the dpeloyment brings it back.
kubectl get pods
kubectl delete pod/nginx-deployment-c5c5db647-5ms8q
kubectl get pod
kubectl describe rs/nginx-demo-rs

# Cleanup
kubectl delete rs/nginx-demo-rs
```

### Deployments

"A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments." - [Source](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

With a Kubernetes Manifest:

```sh
kubectl apply -f kubernetes/deployment.yaml
kubectl get deploy
kubectl get rs
kubectl get pod
kubectl describe deploy/nginx-deployment
kubectl port-forward deployment/nginx-deployment 8080:80
# Try killing a pod, the dpeloyment brings it back.
kubectl get pods
kubectl delete pod/nginx-deployment-c5c5db647-5ms8q
kubectl get pod
kubectl describe deploy/nginx-deployment

# Cleanup
kubectl delete deployment/nginx-deployment
```

You can perform a rolling update with Deployments:

```sh
kubectl set image deployment/nginx-deployment nginx-demo=clarenceb/nginx-demo:v2
```

See: https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/

### Services

```sh
kubectl apply -f kubernetes/service.yaml
```

Wait for Load Balancer IP.

```sh
kubectl get svc
# EXTERNAL-IP
# xx.xx.xx.xx
```

Access the dmeo: http://xx.xx.xx.xx

If using Minikube, change `type: LoadBalancer` to `type: NodePort` and use one of the Node IPs to access the sort.

Cleanup:

```sh
kubectl delete deployment/nginx-deployment
kubectl delete svc/nginx-demo-svc
```