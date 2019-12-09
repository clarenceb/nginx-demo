Using Azure Files for container storage
=======================================

## Create Azure Files Share

```sh
./create-azure-fs.sh
# Storage account name: xxxxxxx
# Storage account key: xxxxxxx==

export AKS_PERS_STORAGE_ACCOUNT_NAME=xxxxxxx
export STORAGE_KEY=xxxxxxx==
```

## Create Kubernetes secret

```sh
kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=$AKS_PERS_STORAGE_ACCOUNT_NAME --from-literal=azurestorageaccountkey=$STORAGE_KEY
```

## Upload the web contents to the Azure File Share

Use Azure Storage Explorer to upload the following folders to the file share:

* web
* web2
* api

## Deploy the demo using Azure Files to access mounted static assets

```sh
kubectl apply -f azure/deployment.yaml
kubectl apply -f azure/service.yaml
```

### Deploy the API

```sh
kubectl apply -f azure/api.deploy.yaml
kubectl apply -f azure/api.svc.yaml
```

Access the API via the Kubernetes service DNS:

```sh
kubectl run nginx-demo --image=<myacr-unique-name>.azurecr.io/nginx-demo --generator=run-pod/v1
apt install -y curl
curl http://nginx-api-svc/countries.json
exit
```

## References

* https://docs.microsoft.com/en-us/azure/aks/azure-files-volume