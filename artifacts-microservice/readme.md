## How to run

```sh
docker run -v /home/javimosch/.npm:/root/.npm -d --restart on-failure --name prak-artifacts-microservice -p 3033:3000 -v "$(pwd):/app" -w /app node:16.15.0-alpine sh entry.sh
```
