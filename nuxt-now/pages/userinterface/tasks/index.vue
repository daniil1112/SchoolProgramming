<template>
  <div>
    <span>Активные задания</span>
    <el-table v-if="started && started.length > 0" :data="started">
      <el-table-column prop="_id" label="№" />
      <el-table-column prop="title" label="Название задания" />
      <el-table-column>
        <template v-slot="scope">
          <el-button @click="toTask(scope)">
            Перейти
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span>Закончившееся задания</span>
    <el-table v-if="stopped && stopped.length > 0" :data="stopped">
      <el-table-column prop="_id" label="№" />
      <el-table-column prop="title" label="Название задания" />
      <el-table-column>
        <template v-slot="scope">
          <el-button @click="toTask(scope)">
            Перейти
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex"
export default {
  middleware: "authStudent",
  name: "Index",
  layout: "student",

  computed: {
    timestamp() {
      return parseInt(new Date(new Date().toISOString()).getTime() / 1000)
    },
    started() {
      if (this.tasks) {
        return this.tasks.filter(
          (e) => new Date(e.startTime) <= new Date() && new Date(e.stopTime) >= new Date()
        )
      }
      return null
    },
    stopped() {
      if (this.tasks) {
        return this.tasks.filter((e) => e.stopTime <= this.timestamp)
      }
      return null
    },
    ...mapState({
      tasks: (state) => state.student.task.tasks,
    }),
  },

  async mounted() {
    await this.$store.dispatch("student/task/loadAllTasks")
  },

  methods: {
    toTask({ row }) {
      this.$router.push("/userinterface/tasks/task/" + row._id)
    },
  },
}
</script>

<style scoped></style>
