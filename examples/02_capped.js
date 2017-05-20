const repl = require('repl').repl

const { play } = repl.context

const mongo = require('..')

module.exports = () => {
    const { tailable, log, compose } = mongo

    const tail = tailable({
        uri: 'mongodb://localhost:27017',
        db: 'test',
        // this must be a capped collection https://docs.mongodb.com/manual/core/capped-collections/
        collection: 'log'
    })

    // tail is Rx Observable of oplog events
    tail
        .do(log) // log out received data
        .flatMap(compose) // transform data into music
        .subscribe(play, console.error) // play music
}
