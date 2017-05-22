'use strict'

const { MongoClient, Timestamp, ObjectID } = require('mongodb')

const Rx = require('node-keyboard-rx')()

const path = require('path')
const repl = require('repl')
const util = require('util')

const chalk = require('chalk')
const examples = require('node-examples')

const { instrument } = repl.repl.context

const mongo = module.exports = {
    query({ uri, db, collection, findQuery = {}, fields = {}, tail = false, includePast = false }) {

        const currentRepl = repl.repl

        const isOplog = db === 'local' && collection === 'oplog.rs'

        const whenConnected = MongoClient.connect(uri)

        return Rx.Observable.fromPromise(whenConnected).concatMap(connection => {
            // SIGINT will close the db connection
            currentRepl.once('SIGINT', () => connection.close())

            if (isOplog && !includePast) {
                findQuery.ts = { $gt: new Timestamp(1, new Date().getTime()/1000) }  // future only
            }

            let cursor = connection
                .db(db)
                .collection(collection)
                .find(findQuery, fields)

            if (tail) {
                cursor = cursor
                    .addCursorFlag('tailable', true)
                    .addCursorFlag('awaitData', true)
            }

            if (isOplog && !includePast) {
                cursor = cursor
                    .addCursorFlag('oplogReplay', true)
            }

            const stream = cursor.stream()

            return Rx.Observable.stream(stream)
        })
    },

    tail({ uri, db, collection, findQuery = {}, fields = {}, includePast }) {
        return mongo.query({
            uri,
            db,
            collection,
            findQuery,
            fields,
            includePast,
            tail: true
        })
    },

    compose(o) {
        const base = 48 // The key: currently C3

        const notes = Object.keys(o).map(key => {
            if (o[key] instanceof ObjectID) return base
            else if (typeof o[key] === 'string') return base + 7 //P5
            else if (typeof o[key] === 'number') return base + 4 //M3
            else if (o[key] instanceof Date) return base + 12 //P8
            else if (Array.isArray(o[key])) return base + 14 //M9
            else if (typeof o[key] === 'object') return base + 10 //m7
            else return base
        })

        return notes
    },

    log(o) {
        console.log(chalk.gray(util.inspect(o)))
    },

    oplog: {
        listen({ uri, includePast }) {
            return mongo.tail({
                uri,
                db: 'local',
                collection: 'oplog.rs',
                includePast
            }).filter(({ op }) => ['i', 'd', 'u', 'c'].indexOf(op) > -1) // filter out noops
        },

        compose({ op, o }) {
            const ins = {
                'i': 'piano',
                'd': 'rock_organ',
                'u': 'koto',
                'c': 'bird_tweet'
            }

            const notes = mongo.compose(o)

            return notes.map(n => instrument(ins[op])(n))
        },

        log({ op, o, ns }) {
            const map = {
                'i': chalk.green('insert'),
                'u': chalk.yellow('update'),
                'd': chalk.red('delete'),
                'c': chalk.blue('command')
            }

            console.log(`${map[op]}: ${chalk.gray(ns)} ${chalk.gray(util.inspect(o))}`)
        }
    }
}

examples({ path: path.join(__dirname, 'examples'), prefix: 'mongo_example_' })
