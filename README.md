#node-keyboard-mongo

[![npm version](https://badge.fury.io/js/.svg)](https://badge.fury.io/js/) 

MongoDB support for node-keyboard

![](https://media.giphy.com/media/WwDOdoeXruPGE/giphy.gif)

##Installation

###As Global
If you installed node-keyboard globally, then install this plugin via `npm i -g node-keyboard-mongo`

Then start node keyboard via `node-keyboard`, and import this plugin via `const mongo = requireg('node-keyboard-mongo')`

###As Local
If instead you cloned node-keyboard, then install locally in that folder via `npm i node-keyboard-mongo`

Then start node keyboard via `node keyboard` and import this plugin via `const mongo = require('node-keyboard-mongo')`

#Usage

```javascript
const oplogStream = mongo.oplog('mongodb://localhost:27000,localhost:27010/?replicaSet=myReplicaSet')
oplogStream.subscribe(play)
```
