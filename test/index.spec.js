const assert = require('assert')

const mongo = require('../')

describe('mongo', function() {
    it('is truthy', () => {
        assert(mongo, ' must be truthy')
    })
})
