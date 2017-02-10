'use strict'

const { MongoClient, Timestamp } = require('mongodb')

const Rx = require('node-keyboard-rx')()

const repl = require('repl')
const util = require('util')

const chalk = require('chalk')

const { instrument } = repl.repl.context

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
    },

    compose({ op, o }) {
        const ins = {
            'i': 'timpani',
            'd': 'gunshot',
            'u': 'koto',
            'c': 'bird_tweet'
        }

        const len = util.inspect(o).length

        const note = (len % 88 + 21)

        return instrument(ins[op])(note)
    },

    log({ op, o, ns }) {
        const map = {
            'i': chalk.green('insert'),
            'u': chalk.yellow('update'),
            'd': chalk.red('delete'),
            'c': chalk.blue('command')
        }

        console.log(`${map[op]}: ${chalk.gray(ns)}`) // ${chalk.gray(util.inspect(o))}

        return { op, o, ns }
    }
}
