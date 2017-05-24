const repl = require('repl').repl

const { play } = repl.context

const Rx = require('node-keyboard-rx')()

const mongo = require('..')

module.exports = () => {
    const { query, log, compose } = mongo

    // to test start mongo on localhost:26000
    // > mongod --port 26000
    // then run shell
    // > mongo --port 26000
    // insert docs
    // > db.getSiblingDB('test').users.insert({})

    const cursor = query({
        uri: 'mongodb://localhost:26000',
        db: 'test',
        collection: 'users',
        findQuery: {
            name: {
                $exists: 1
            }
        }
    })

    // tail is Rx Observable of oplog events
    cursor
        .concatMap(x => Rx.Observable.of(x).delay(500))
        .do(log) // log out received data
        .flatMap(compose) // transform data into music
        .subscribe(play, console.error) // play music
}
