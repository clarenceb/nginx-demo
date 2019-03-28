# Debian 10
FROM debian:buster

LABEL Maintainer "John Citizen"

RUN apt-get update && \
    apt-get install -y nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
