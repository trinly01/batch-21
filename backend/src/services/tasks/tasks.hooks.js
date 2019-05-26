const { authenticate } = require('@feathersjs/authentication').hooks;

function addTimestamp (context) {
  context.data.createdAt = Date.now()
} 

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ addTimestamp ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
