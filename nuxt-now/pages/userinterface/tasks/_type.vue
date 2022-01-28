<template>
  <div>
    <div>
      <!--            Несколько страниц пагинациии-->
      <span>Активные задания</span>
      <el-table v-if="started && started.length > 0" :data="started">
        <el-table-column prop="_id" label="№" />
        <el-table-column prop="title" label="Название задания" />

        <el-table-column v-if= "$route.params.type === 'programming'">
          <template v-slot="scope">

            <span v-if="!scope.row.options.template" class="badge badge-pill badge-success">Обычное задание</span>
            <span v-else class="badge badge-pill badge-danger">Задание с заданным шаблоном</span>
          </template>
        </el-table-column>
        <el-table-column v-if="">
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
        <el-table-column v-if= "$route.params.type === 'programming'">
          <template v-slot="scope">
            <span v-if="!scope.row.options.template" class="badge badge-pill badge-success">Обычное задание</span>
            <span v-else class="badge badge-pill badge-danger">Задание с заданным шаблоном</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template v-slot="scope">
            <el-button @click="toTask(scope)">
              Перейти
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"


import Vue from 'vue'

export default {
  name: "TasksType",
  layout: "student",
  middleware: "authStudent",
  validate({ params }) {
    return (
      /^(tests)$/i.test(params.type) || /^(programming)$/i.test(params.type)
    )
  },

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
    },
    stopped() {
      if (this.tasks) {
        return this.tasks.filter((e) => new Date(e.stopTime) < new Date())
      }
    },

    tasks() {
      if (this.$route.params.type === "tests")
        return this.$store.getters["student/task/tasks"](1)
      return this.$store.getters["student/task/tasks"](2)
    },
  },

  async mounted() {
    if (this.$route.params.type === "tests")
      await this.$store.dispatch("student/task/loadTestTasks")
    else await this.$store.dispatch("student/task/loadProgrammingTasks")
  },
  methods: {
    toTask({ row }) {
      this.$router.push("/userinterface/tasks/task/" + row._id)
    },
  },
}
</script>

<style scoped></style>
