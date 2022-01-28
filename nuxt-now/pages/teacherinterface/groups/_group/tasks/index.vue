<template>
  <div>
    <div v-if="!loading">
      <v-card class="box-card cardTasks" color="grey lighten-4" shadow="hover">
        <div slot="header" class="clearfix">
          <v-toolbar height="100">
            <v-toolbar-title>Задачи</v-toolbar-title>
            <v-spacer />
            <v-btn icon>
              <i
                      class="el-icon-plus"
                      @click="
                $router.push(
                  '/teacherinterface/groups/' + $route.params.group + '/addTask'
                )
              "
              />
            </v-btn>
          </v-toolbar>
        </div>
        <mdb-tbl hover>
          <mdb-tbl-head color="grey">
            <tr>
              <th>#</th>
              <th>Заголовок</th>
              <th>Тип задания</th>
              <th><mdb-icon far icon="clock" class="indigo-text"/> Время начала</th>
              <th><mdb-icon icon="stopwatch" class="teal-text"/> Время окончания</th>
              <th></th>
              <th></th>
            </tr>
          </mdb-tbl-head>
          <mdb-tbl-body v-for="task in tasks">
            <tr>
              <td v-html="task._id"/>
              <td v-html="task.title"/>
              <td>
                <mdb-badge tag="a" href="#" color="secondary" v-if="task.type===1">Тестовое задание</mdb-badge>
                <mdb-badge tag="a" href="#" color="success" v-if="task.type===2">Задание по програмированию</mdb-badge>
              </td>
              <td v-html="generateDate(task.startTime)"/>
              <td v-html="generateDate(task.stopTime)"/>
              <td>
                <mdb-btn @click="$router.push(`/teacherinterface/groups/${$route.params.group}/tasks/${task._id}`)">Результаты</mdb-btn>
              </td>
              <td>
                <mdb-btn @click="$router.push(`/teacherinterface/groups/${$route.params.group}/tasks/${task._id}/update`)">Управление заданием</mdb-btn>
              </td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
        <mdb-pagination color="red" circle>
          <mdb-page-nav prev></mdb-page-nav>
          <mdb-page-item
                  v-for="i in paginationList"
                  :active="i === pagination"
                  @click="setPagination(i)"
          >
            {{i}}
          </mdb-page-item>
          <mdb-page-nav next></mdb-page-nav>
        </mdb-pagination>
      </v-card>
    </div>
    <mdb-container v-else>
      <div class="ph-item">
        <div class="ph-col-12">
          <div class="ph-picture"></div>
        </div>
      </div>
    </mdb-container>

  </div>
</template>

<script>
import dateformat from 'dateformat'
import timestampToDate from "timestamp-to-date"
export default {
  layout: "teacher",
  middleware: "authTeacher",
  name: "Tasks",

  data() {
    return {
      groupTasks: null,
      loading: true,
      pagination: 1,
      perPage: 4
    }
  },

  computed:{
    counter(){
      return this.$store.getters['teacher/tasks/groupTasks/counter'](parseInt(this.$route.params.group))
    },
    paginationList(){
      if (this.counter){
        return Math.ceil(this.counter/this.perPage)
      }
      return 1
    },
    tasks(){
      return this.$store.getters['teacher/tasks/groupTasks/tasks']({
        group: parseInt(this.$route.params.group),
        page: this.pagination,
        pp: this.perPage
      })
    }
  },

  async mounted() {
    await this.loadCounter()
    await this.loadCreatedTasks()
    this.loading = false
  },

  methods: {
    async loadCreatedTasks() {
      await this.$store.dispatch('teacher/tasks/groupTasks/loadSomeTasks', {
        group: parseInt(this.$route.params.group),
        pp: this.perPage,
        force: false
      })
      this.$store.dispatch('teacher/tasks/groupTasks/loadAllTasks', {
        group: parseInt(this.$route.params.group),
        force: false
      })
    },

    async loadCounter(){
      await this.$store.dispatch('teacher/tasks/groupTasks/loadCounter', {
        group: parseInt(this.$route.params.group),
        force: false
      })
    },
    getDate(timestamp) {
      return timestampToDate(timestamp * 1000, "yyyy-MM-dd HH:mm:ss")
    },
    generateDate(iso){
      try {
        let date = new Date(iso)
        return  dateformat(date,'dd.mm.yyyy HH:mm:ss')
      } catch (e) {

      }

    },
    setPagination(index){
      this.pagination = index;
    }
  },
}
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.cardTasks {
  width: 100%;
}
</style>
