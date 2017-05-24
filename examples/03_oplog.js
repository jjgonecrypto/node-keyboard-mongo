const repl = require('repl').repl

const { play } = repl.context

const mongo = require('..')

module.exports = () => {
    const { listen, log, compose } = mongo.oplog

    // to test start mongod
    // > mongod --port 26000 --replSet myRS
    // then run shell
    // > mongo --port 26000
    // then start replSet in mongo shell
    // > rs.initiate({ _id: "myRS", members: [{ _id: 1, host: "localhost:26000" }]})

    const oplogStream = listen({
        uri: 'mongodb://localhost:26000/?replicaSet=myRS'
    })

    // oplogStream is Rx Observable of oplog events
    oplogStream
        .do(log) // log out received data
        .flatMap(compose) // transform data into music
        .subscribe(play, console.error) // play music
}
