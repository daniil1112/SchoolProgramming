<template>
  <mdb-card>
    <mdb-card-title>
      Все задания по програмированию
    </mdb-card-title>
    <mdb-card-body>
      <mdb-container>
        <el-table v-if="paginateNotes && paginateNotes.length > 0" :data="paginateNotes">
          <el-table-column prop="_id" label="№"/>
          <el-table-column label="Заголовок"
                           prop="title"
          />
          <el-table-column label="Готова к размещению"
                           sortable
                           prop="readySpan"
          />
          <el-table-column label="К задаче">
            <template slot-scope="scope">
              <mdb-btn @click="$router.push(`/teacherinterface/materials/programming/${scope.row._id}/view`)">К просмотру</mdb-btn>
            </template>
          </el-table-column>

<!--          TODO тема задания-->
        </el-table>
        <mdb-pagination v-if="!loading">
          <mdb-page-nav prev :disabled="pagination === 1" @click.native="pagination = pagination - 1"></mdb-page-nav>
          <div v-for="(e, i) in paginationPages">
            <mdb-page-item :active="pagination === e" @click="pagination=e">{{e}}</mdb-page-item>
          </div>
          <mdb-page-nav next :disabled="pagination === paginationPages" @click.native="pagination = pagination + 1"></mdb-page-nav>
        </mdb-pagination>
      </mdb-container>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
export default {
  name: "all",
  layout: "teacher",
  middleware: "authTeacher",

  data() {
    return {
      pagination: 1,
      PP:20,
      loading: true
    }
  },

  computed:{
    counter(){
      return this.$store.getters['teacher/programming/task/counter']
    },
    paginationPages(){
      if (this.counter) {
        return Math.ceil(this.counter / this.PP)
      }
      return 1
    },
    tasks(){
      return this.$store.getters['teacher/programming/task/tasks']
    },
    paginateNotes(){
      const {pagination, PP, tasks} = this
      let start = (pagination - 1) * PP;
      let end = start + PP;

      if (tasks){
        let notes = tasks.slice(start, end)

        notes.forEach((e, i) => {
          if (e.ready) notes[i].readySpan = 'Да'
          else notes[i].readySpan = 'Нет'
        })
        return notes
      }



    },

  },


  async mounted() {
    await this.loadCounter()
    await this.loadTasks()
    this.loading = false
  },

  methods:{
    async loadCounter(){
      await this.$store.dispatch('teacher/programming/task/loadCounter')
    },
    async loadTasks(){
      await this.$store.dispatch('teacher/programming/task/loadAllTasks')
    }
  }
}
</script>

<style scoped>

</style>