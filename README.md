# node-keyboard-mongo

[![npm version](https://badge.fury.io/js/.svg)](https://badge.fury.io/js/)

MongoDB support for [node-keyboard](../node-keyboard)

![](https://media.giphy.com/media/WwDOdoeXruPGE/giphy.gif)

## Installation

### As Global
If you installed node-keyboard globally, then install this plugin via `npm i -g node-keyboard-mongo`

Then start node keyboard via `node-keyboard`, and import this plugin via `const mongo = requireg('node-keyboard-mongo')`

### As Local
If instead you cloned node-keyboard, then install locally in that folder via `npm i node-keyboard-mongo`

Then start node keyboard via `node keyboard` and import this plugin via `const mongo = require('node-keyboard-mongo')`

## Usage

```javascript
// connect to a MongoDB replicaSet via a connection string[1]
const oplogStream = mongo.oplog({ uri: 'mongodb://localhost:27000,localhost:27010/?replicaSet=myReplicaSet' })

oplogStream
    .do(mongo.log) // log out received data
    .flatMap(mongo.compose) // transform data into music
    .subscribe(play) // play music
```

See all oplog entries, add the `includePast` flag

```javascript
// add includePast flag
mongo.oplog({ uri: ..., includePast: true })
```

Tail any capped collection:

```javascript
// tail a mongodb capped collection
const tail = mongo.tailable({ uri: 'mongodb://...', db: '...', collection: '...', findQuery: { ... } })

tail.subscribe(console.log, console.error)
```



> 1. [MongoDB Docs: Connection string](https://docs.mongodb.com/manual/reference/connection-string/)
