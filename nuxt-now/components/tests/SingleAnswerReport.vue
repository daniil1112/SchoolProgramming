<template>
  <div>
    <el-card>
      <p>Тест с одним правильным ответом</p>
      <h4>{{ test.title }}</h4>
      <p>{{ test.task }}</p>

      <el-alert
        v-if="this.answer && this.answer === this.test.rightAnswer"
        title="Верный ответ"
        type="success"
        show-icon
      />
      <el-alert
        v-else-if="this.answer && this.answer !== this.test.rightAnswer"
        title="Ответ неверный"
        type="error"
        show-icon
      />
      <el-alert v-else title="Ответ не был получен" type="warning" show-icon />
      <div>
        <el-table
          :data="test.answerChoice"
          :row-class-name="tableRowClassName"
          class="el-table el-table-collapsed"
        >
          <el-table-column label="Ответ" prop="answer" />
          <el-table-column>
            <template scope="scope">
              {{ tableRowClassName(scope) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SingleAnswerReport",
  props: ["test", "answer"],

  methods: {
    tableRowClassName({ row }) {
      if (!this.answer) {
        if (row.id === this.test.rightAnswer)
          return "not-selected-answer-single-test-report"
      } else {
        if (row.id === this.answer && row.id === this.test.rightAnswer)
          return "right-answer-single-test-report"
        else if (row.id === this.answer)
          return "error-answer-single-test-report"
        else if (row.id === this.test.rightAnswer)
          return "not-selected-answer-single-test-report"
      }

      return ""
    },
  },
}
</script>

<style>
.el-table .error-answer-single-test-report {
  background-color: orangered;
}
.el-table .right-answer-single-test-report {
  background-color: #28a745;
}

.el-table .not-selected-answer-single-test-report {
  background-color: #0074d9;
}
</style>
