const repl = require('repl').repl

const { play } = repl.context

const mongo = require('..')

module.exports = () => {
    const { tail, log, compose } = mongo

    // to test start mongod
    // > mongod --port 26000
    // then run shell
    // > mongo --port 26000
    // then create capped collection in
    // > db.getSiblingDB('example').createCollection("log", { capped : true, size : 1024e3, max : 1000 } )
    // add a document to ensure there
    // > db.getSiblingDB('example').log.insert({})

    const cursor = tail({
        uri: 'mongodb://localhost:26000',
        db: 'example',
        // this must be a capped collection https://docs.mongodb.com/manual/core/capped-collections/
        collection: 'log'
    })

    // tail is Rx Observable of oplog events
    cursor
        .do(log) // log out received data
        .flatMap(compose) // transform data into music
        .subscribe(play, console.error) // play music
}
