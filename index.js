'use strict'

const { MongoClient, Timestamp } = require('mongodb')

module.exports = {
    oplog(uri, options = { }) {

        const { includePast } = options

        //'mongodb://localhost:27000,localhost:27010/?replicaSet=backup_test'
        MongoClient.connect(uri, (err, db) => {
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

            stream.on('end', function () {
                console.log('stream ended')
            })

            stream.on('data', function (data) {
                console.log(data)
            })

            stream.on('error', function (err) {
                console.log(err)
            })
        })
    }
}
