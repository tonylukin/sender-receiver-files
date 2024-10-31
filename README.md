## How to use
```bash
curl -X POST http://localhost:3009/send/file \
   -H "Content-Type: application/json" \
   -d '{
         "filePath": "*absolute path to any file*",
         "receiverUrl": "http://localhost:3009"
       }'
```
Destination file will be assembled in [root]/output directory

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

