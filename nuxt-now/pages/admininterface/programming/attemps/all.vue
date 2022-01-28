<template>
  <div>
    <el-button v-if="!loading" type="info" @click="reloadTasks">
      Перезагрузить
    </el-button>
    <el-table
      v-if="attemps && !loading"
      v-loading="loading"
      :data="attemps"
      :default-sort="{ prop: '_id', order: 'descending' }"
    >
      <el-table-column prop="_id" label="ID" />
      <el-table-column prop="type" label="Type" />
      <el-table-column prop="status" label="status" />
      <el-table-column>
        <template slot-scope="scope">
          <el-button circle icon="el-icon-refresh" @click="reloadTask(scope)" />
          <el-button
            circle
            icon="el-icon-delete"
            @click="deleteAttemp(scope)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="!loading && count"
      layout="prev, pager, next, jumper"
      background
      :total="count"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "All",
  data: function () {
    return {
      loading: true,
      attemps: null,
      count: null,
      page: 1,
    }
  },
  async mounted() {
    await this.reloadTasks(this.page)
    await this.countAttemps()
    this.loading = false
  },

  methods: {
    async reloadTask({ row }) {
      await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/admin/programming/reloadAttemp",
        {
          attemp: row._id,
        }
      )
      this.reloadTasks()
    },
    async reloadTasks() {
      const result = await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/admin/programming/loadProgrammingAttemps",
        {
          page: this.page,
        }
      )
      if (result.data.attemps) this.attemps = result.data.attemps
    },
    async deleteAttemp({ row }) {
      const result = await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/admin/programming/deleteAttemp",
        {
          attemp: row._id,
        }
      )
      this.reloadTasks()
    },
    async countAttemps() {
      const result = await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/admin/programming/countAttemps"
      )
      if (result.data.count) this.count = result.data.count
    },
    handleCurrentChange(val) {
      this.page = val
      this.reloadTasks(val)
    },
  },
}
</script>

<style scoped></style>
