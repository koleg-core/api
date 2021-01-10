#!/bin/bash
# Author: github.com/dauliac
# Date:   01/10/21
# Version: 0.0.1
# Description: Create config secrets for api

kubectl delete secret koleg-api-config -n develop
kubectl delete secret koleg-api-config -n master
ln -sf ../config-development.yml config.yml
kubectl create secret generic -n develop koleg-api-config --from-file=config.yml
ln -sf ../config-production.yml config.yml
kubectl create secret generic -n master koleg-api-config --from-file=config.yml
rm -f config.yml
