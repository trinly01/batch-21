// import something here
import $dbCon from 'wings-feathers'

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.prototype.$dbCon = $dbCon('http://localhost:3030', {
    'todos': {
      query: {
        done: false
      },
      channels: [
        {
          value: false,
          prop: 'done'
        }
      ]
    },
    tasks: {
      query: {
        done: false
      },
      channels: [
        {
          value: false,
          prop: 'done'
        }
      ]
    }
  })
}
