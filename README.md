# Jobascript

### Install Dependencies
``` bash
npm install 
```

### Build
Calling gulp will use webpack to bundle your files, in the dist folder, and automatically lint your files.
``` bash
gulp
```

### Rebuild Database
In some case you might need to rebuild the DB, change `dropDB` to `true` in `env.json`
``` json
{
  "development": {
    "database": "dev.sqlite3",
    "dropDB": false
  },
  "production": {
    "database": "prod.sqlite3",
    "dropDB": false
  },
  "test": {
    "database": "test.sqlite3",
    "dropDB": true
  }
}
```

### Start Server
``` bash
nodemon server/index.js

```
