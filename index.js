'use strict'

const { MongoClient, Timestamp } = require('mongodb')

const Rx = require('node-keyboard-rx')()

const repl = require('repl')

module.exports = {
    oplog(uri, options = { }) {
        const currentRepl = repl.repl

        const { includePast } = options

        const whenConnected = MongoClient.connect(uri)
        whenConnected.catch(console.error)

        return Rx.Observable.fromPromise(whenConnected).concatMap(db => {
            // SIGINT will close the db connection
            currentRepl.once('SIGINT', () => db.close())

            const findQuery = { ns: /.+/ }
            if (!includePast) {
                findQuery.ts = { $gt: new Timestamp(1, new Date().getTime()/1000) }  // future only
            }

            let oplog = db
                .db('local')
                .collection('oplog.rs')
                .find(findQuery)
                .addCursorFlag('tailable', true)
                .addCursorFlag('awaitData', true)

            if (!includePast) {
                oplog = oplog.addCursorFlag('oplogReplay', true)
            }

            const stream = oplog.stream()

            return Rx.Observable.fromEvent(stream, 'data')
        })
    }
}
