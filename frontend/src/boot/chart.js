// import something here
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

// "async" is optional
export default async ({ Vue }) => {
  // something to do
  Vue.use(VueChartkick, { adapter: Chart })
}
