# NetGuru recruitment task - node js

---

## Stack

- Typescript
- Koa.js
- Mongo.js

### Tests

- Jest
- Supertest
- MSW

### CI/CD

- Github Actions

---

## Usage

### Requirements
 
- Node >= 12
- NPM
- Docker
- docker-compose >= 3.3

### Basic usage

API may be started using `docker-compose -d up`.
By default, the API will user port 3000. It can be changed using environmental variable `APP_PORT`.
Using this method the database for the API will be created automatically. 

API can also be started directly. To achieve that, install all packages `npm i` and then it can be started in development mode by using `npm start`. No database will be started in that case.

To supply your own database, use `DATABASE` environmental variable for the address of the database.

In both cases environmental variable `JWT_SECRET` may be provided to set the JWT secret used to decrypt authentication token. If none provided, `secret` will be used.

### API

##### GET /movies

**USAGE** : Fetches list of movies created

**INPUT** :  None

**OUTPUT** : List of [Movies](#Types)

##### POST /movies

**USAGE** : Creates a movie with provided title using data from [OMDB](http://www.omdbapi.com/)

**INPUT** :  Body `{title:string - title of movie}`

**OUTPUT** : None

ℹ Requires [Authorization](#Authorization)

⚠ If authorized as user with `basic` role, only 5 movies may be created per calendar month.

### Tests

To run tests, install packages `npm i` then use the test command `npm test`. Tests may also be run in watch mode `npm run test:watch`

⚠ Tests may not work on Windows and some Linux distros due to lack of libraries. To fix the issue on Linux, ensure `libcrypt.o.10` is installed.

## Authorization

Authorization is done by JWT token provided in `authorization` header. It should be in form `Bearer <token>`. It can be obtained by using [authorization service](https://github.com/netguru/nodejs-recruitment-task)

##Types

###Movie

```ts
interface Movie {
  Title: string // Title of the movie
  "Released": string // Date of the release of the movie
  "Genre": string // List of genres, separated by ','
  "Directory": string // List of directors, separated by ','
}
```