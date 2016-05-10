# Jobascript

### Install Dependencies
``` bash
npm install 
```

### Postgres

Create DB User
``` bash
createuser -P jbs
```

Create DB
``` bash
createdb jobascript.dev jbs
```

Building schema

``` bash
psql -f ./jbs.sql jobascript.dev jbs
```

### Build
Calling gulp will use webpack to bundle your files, in the dist folder, and automatically lint your files.
``` bash
gulp
```

### Debug
Change `debug` to `true` in `env.json`
``` json
{
  "development": {
    "dbName": "jobascript.dev",
    "debug": true,
    "clearbitKey": "98d8c9be83606358bfc9453ac48a127f"
  },
  "production": {
    "dbName": "jobascript",
    "debug": false,
    "clearbitKey": "98d8c9be83606358bfc9453ac48a127f"
  },
  "test": {
    "dbName": "jobascript.test",
    "debug": false
  }
}
```

### Start Server
``` bash
nodemon server/index.js

```
