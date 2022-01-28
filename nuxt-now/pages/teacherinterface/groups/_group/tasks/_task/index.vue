<template>
  <div>
    <el-table :data="students" v-if="students && reports.length > 0">
      <el-table-column prop="_id" label="Номер" />
      <el-table-column prop="name" label="Имя" />
      <el-table-column label="Баллов">
        <template v-slot="scope">
          <span v-html="getPersent(scope)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Task",
  layout: "teacher",
  middleware: "authTeacher",
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.task)
  },

  data() {
    return {
      students: [],
      reports: [],
    }
  },
  async mounted() {
    this.loadClass()
    this.loadReports()
  },

  methods: {
    async loadClass() {
      const result = await this.$axios.post("/api/teacher/groups/loadClass", {
        group: this.$route.params.group,
      })
      if (result.data.students) {
        this.students = result.data.students
      }
    },
    async loadReports() {
      const result = await this.$axios.post("/api/teacher/groups/loadReports", {
        task: this.$route.params.task,
        group: this.$route.params.group,
      })

      if (result.data.reports) {
        this.reports = result.data.reports
      }
    },
    getPersent({ row }) {
      let report = this.reports.find((e) => e.user === row._id)
      if (typeof report.points === 'undefined') return '-'
      return report.points
    },
  },
}
</script>

<style scoped></style>
