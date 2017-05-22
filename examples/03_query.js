const repl = require('repl').repl

const { play } = repl.context

const mongo = require('..')

module.exports = () => {
    const { query, log, compose } = mongo

    const cursor = query({
        uri: 'mongodb://localhost:26000',
        db: 'test',
        // this must be a capped collection https://docs.mongodb.com/manual/core/capped-collections/
        collection: 'log',
        findQuery: {
            name: {
                $exists: 1
            }
        }
    })

    // tail is Rx Observable of oplog events
    cursor
        .do(log) // log out received data
        .flatMap(compose) // transform data into music
        .subscribe(play, console.error) // play music
}
