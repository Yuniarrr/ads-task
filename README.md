# Node.js, Express.js, Sequelize.js and PostgreSQL RESTful API

This source code is part of [Node.js, Express.js, Sequelize.js and PostgreSQL RESTful API](https://www.djamware.com/post/5b56a6cc80aca707dd4f65a9/nodejs-expressjs-sequelizejs-and-postgresql-restful-api) tutorial.

To run locally:

- This repository uses 2 databases with Docker, namely postgresql and mysql
- Create database with the name same as in config file
- By default this backend use port 3000
- Run `npm run install`
- Run `npm run setup`
- Run `npm run migrate:db1` and `npm run migrate:db2`
- Run `npm run seed:db1` and `npm run seed:db2`
- Run `npm run start:dev`

## You can also change the configuration in .env file

```
MYSQL_DATABASE=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_PORT=

POSTGRESQL_DATABASE=
POSTGRESQL_USERNAME=
POSTGRESQL_PASSWORD=
POSTGRESQL_PORT=

JWT_SECRET=
JWT_EXPIRES_IN=

AUTHENTICATOR_ISSUER=

DB_HOSTNAME=

NODE_ENV="development"
```

## How to get number from 2FA??

1. You can access `localhost:${port}`
2. Input the otp url
3. Use chrome/google authenticator
4. Copy the number
5. Paste in `/auth/otp/verify`

## Documentations

You can access documentations from postman use [this link.](https://www.postman.com/spaceflight-explorer-58206787/workspace/ads-digital-partner/collection/28599911-8b9cc33a-f841-4d43-a820-aa78be3bb4bc)
