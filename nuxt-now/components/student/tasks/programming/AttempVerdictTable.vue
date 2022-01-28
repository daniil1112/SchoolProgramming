<template>
  <div>
    <el-table
      v-if="visibleTestsTable"
      :data="verdict.launchMSG"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="Compiler">
        <template slot-scope="scope">
          <span v-if="visibleCompilerAnswer" v-html="scope.row" />
          <span v-else>Скрыто</span>
        </template>
      </el-table-column>
      <el-table-column v-if="visibleTests" label="Input/Output">
        <template slot-scope="scope">
          <el-button @click="loadInput(scope)">
            <i class="el-icon-download" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>
      Тесты для этой задачи закрыты
    </div>
  </div>
</template>

<script>
export default {
  name: "AttempVerdictTable",
  props: [
    "verdict",
    "visibleCompilerAnswer",
    'visibleTestsTable',
    "visibleTests",
    "groupTask",
    "attempId",
  ],

  methods: {
    tableRowClassName({row}) {
      if (row === "OK") {
        return "success-row-verdict"
      } else {
        return "danger-row-verdict"
      }
    },
    async loadInput({ $index }) {
      if (this.visibleTests) {
        const result = await this.$axios.post(
          "/api/student/programming/loadInput",
          {
            attempId: this.attempId,
            test: $index + 1,
            groupTask: this.groupTask,
          }
        )
        if (result.data.input && result.data.output) {
          let text, fileName

          text = `input: ${result.data.input} output: ${result.data.output}`

          fileName = `test_${$index+1}.txt`

          this.$loadTextFile({
            text,
            fileName,
          })
        } else {
          if (result.data.error) {
            if (result.data.code === 1) {
              this.$notify.error({
                title: "Ошибка при загрузке",
                message: "Вы не можете загрузить текст ввода и вывода",
              })
            }
          }
        }
      }
    },
  },
}
</script>

<style scoped></style>
