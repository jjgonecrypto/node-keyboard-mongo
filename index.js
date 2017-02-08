'use strict'

const { MongoClient, Timestamp } = require('mongodb')

const Rx = require('node-keyboard-rx')()

module.exports = {
    oplog(uri, options = { }) {

        const { includePast } = options

        const whenConnected = MongoClient.connect(uri)
        whenConnected.catch(console.error)

        return Rx.Observable.fromPromise(whenConnected).concatMap(db => {
            console.log('Connected correctly to server')

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
