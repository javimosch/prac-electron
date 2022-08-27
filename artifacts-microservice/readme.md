## How to run

```sh
docker run -d --name prak-artifacts-microservice --rm -p 3033:3000 -v "$(pwd):/app" -w /app node:16.15.0-alpine sh entry.sh
```
