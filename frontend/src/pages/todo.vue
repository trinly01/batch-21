<template>
  <div>
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title>
        Todo App {{ task.desc }} ({{ todos.length }}/{{ $dbCon.services.tasks.total }})
      </q-toolbar-title>
      <q-btn v-if="!logggedIn" label="batch 21 Login" @click="login" />
      <q-btn v-else label="Logout" @click="$dbCon.logout(), logggedIn = false" />
    </q-toolbar>
    <div class="q-pa-md">
      <div class="row">
        <q-input @keyup.enter="addTask" class="col" v-model="task.desc" label="Task" />
        <q-btn @click="addTask" :disabled="!task.desc" icon="add" round color="primary"></q-btn>
      </div>
      <q-tabs
        v-model="tab"
        inline-label
        class="bg-primary text-white shadow-2"
      >
        <q-tab @click="showOngoing" name="ongoing" icon="timer" label="On-going" />
        <q-tab @click="showCompleted" name="done" icon="check_circle" label="Cempleted" />
      </q-tabs>
      <!-- <r-hello name="Raino"></r-hello> -->
      <!-- <r-hello name="Aron"></r-hello> -->
      <!-- <ul>
        <li v-for="(todo, index) in todos" :key="index">
          {{ index + 1 }} - {{ todo.desc }}
        </li>
      </ul> -->
      <q-list bordered>
        <q-item clickable v-ripple v-for="(todo, index) in todos" :key="index">
          <q-item-section avatar>
            <q-checkbox :value="todo.done" @input="toggleDone(todo)" />
          </q-item-section>
          <q-item-section> {{ todo.desc }} - {{ todo.done ? 'tapos na' : 'on going' }} </q-item-section>
          <q-item-section avatar>
            <q-btn @click="removeTask(todo._id)" round icon="delete" color="negative" size="sm"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn @click="clearTasks" >Clear Finished Tasks</q-btn>
      <q-btn color="pink" @click="$dbCon.services.tasks.loadMoreData()" >Load more...</q-btn>
      <q-btn color="pink" @click="$dbCon.services.tasks.loadAllData()" >Load All</q-btn>
      <pie-chart :donut="true" :data="chartData" :library="{animation: { easing: 'easeOutBounce' }}"></pie-chart>
    </div>
    <q-dialog v-model="dialogDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="signal_wifi_off" color="primary" text-color="white" /> -->
          <span v-if="todos[selected]" class="q-ml-sm">Are you sure you want to delete <b>"{{ todos[selected].desc }}"</b></span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Geh geh" color="negative" v-close-popup @click="gehgeh" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
// import rHello from 'components/rey.vue'
export default {
  components: {
    // rHello
  },
  beforeDestroy () {
    // kill all event listeners
  },
  mounted () {
    let asd = this.$dbCon.services.tasks.onDataChange(data => {
      this.todos = data
      console.log('Hello')
    })
    console.log('listner', asd)
    this.$dbCon.authenticate()
    this.$dbCon.on('authenticated', (asd) => {
      this.logggedIn = true
      this.showOngoing()
    })
  },
  data: () => ({
    tab: 'ongoing',
    dialogDelete: false,
    selected: -1,
    task: {
      desc: '',
      done: false,
      owner: 'Huawei De Guzman'
    },
    todos: [],
    chartData: [],
    logggedIn: false
  }),
  // computed: {
  //   chartData () {
  //     return [['Done', this.finishedTasks], ['Ongoing', this.ongoingTasks]]
  //   },
  //   finishedTasks () {
  //     return this.todos.filter(t => t.done).length
  //   },
  //   ongoingTasks () {
  //     return this.todos.filter(t => !t.done).length
  //   }
  // },
  watch: {
    async todos (old, bago) {
      // [['Done', this.finishedTasks], ['Ongoing', this.ongoingTasks]]
      let taposNaResult = await this.$dbCon.services.tasks.find({
        query: {
          $limit: 0,
          done: true
        }
      })
      let onGoingResult = await this.$dbCon.services.tasks.find({
        query: {
          $limit: 0,
          done: false
        }
      })
      this.chartData = [['Done', taposNaResult.total], ['Ongoing', onGoingResult.total]]
    }
  },
  methods: {
    login () {
      this.$dbCon.authenticate({
        strategy: 'local',
        email: '3364@mail.com',
        password: '3364'
      })
    },
    showOngoing () {
      this.$dbCon.services.tasks.reQuery({
        query: {
          done: false,
          $sort: {
            createdAt: -1
          }
        },
        channels: [
          {
            value: false,
            prop: 'done'
          }
        ]
      })
    },
    showCompleted () {
      this.$dbCon.services.tasks.reQuery({
        query: {
          done: true
        },
        channels: [
          {
            value: true,
            prop: 'done'
          }
        ]
      })
    },
    addTask () {
      // this.todos.push({ ...this.task })
      this.$dbCon.services.tasks.create({ ...this.task })
      this.task.desc = ''
    },
    removeTask (index) {
      this.selected = index
      this.dialogDelete = true
    },
    gehgeh () {
      // this.todos.splice(this.selected, 1)
      this.$dbCon.services.tasks.remove(this.selected)
    },
    toggleDone (t) {
      this.$dbCon.services.tasks.patch(t._id, {
        done: !t.done
      })
    },
    clearTasks () {
      // this.todos = this.todos.filter(t => !t.done)
      this.$dbCon.services.tasks.remove(null, {
        query: {
          done: true
        }
      })
    },
    async find () {
      let res = await this.$dbCon.services.tasks.find({
        query: {
          done: false
        }
      })
      console.log('RESULT', res)
    }
  }
}
</script>
