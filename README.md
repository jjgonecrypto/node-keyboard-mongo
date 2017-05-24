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

* `oplog.listen({ uri: String, includePast: Boolean = false })`
* `tail({ uri: String, db: String, collection: String, findQuery: Object = {}, fields: Object = {} })`
* `query({ uri: String, db: String, collection: String, findQuery: Object = {}, fields: Object = {} })`

## Examples

* [query](./examples/01_query.js)
* [capped collection](./examples/02_capped.js)
* [oplog](./examples/03_oplog.js)

> Ref:
> 1. [MongoDB Docs: Connection string](https://docs.mongodb.com/manual/reference/connection-string/)
