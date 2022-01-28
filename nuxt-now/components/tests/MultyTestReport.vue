<template>
  <div>
    <el-card>
      <p>Тест с несколькими правильными ответами</p>
      <h4>{{ test.title }}</h4>
      <p>{{ test.task }}</p>

      <el-alert
        v-if="!this.answer"
        title="Ответ не был получен"
        type="warning"
        show-icon
      />
      <el-alert
        v-else-if="isRightAnswer"
        title="Верный ответ"
        type="success"
        show-icon
      />
      <el-alert v-else title="Ответ неверный" type="error" show-icon />

      <div>
        <el-table
          :data="test.answerChoice"
          :row-class-name="tableRowClassName"
          class="el-table el-table-collapsed"
        >
          <el-table-column label="Ответ" prop="answer" />
          <el-table-column>
            <template slot-scope="scope">
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

  computed: {
    isRightAnswer() {
      let result = true
      if (
        !this.answer &&
        !this.test.rightAnswer &&
        this.answer.length !== this.test.rightAnswer.length
      )
        result = false
      this.test.rightAnswer.forEach((element) => {
        if (!this.answer.some((answer) => answer === element)) result = false
      })
      return result
    },
  },

  methods: {
    tableRowClassName({ row }) {
      if (!this.answer) {
        if (this.test.rightAnswer.some((e) => e === row.id))
          return "not-selected-answer-single-test-report"
      } else {
        if (
          this.test.rightAnswer.some((e) => e === row.id) &&
          this.answer.some((e) => e === row.id)
        )
          return "right-answer-single-test-report"
        else if (this.answer.some((e) => e === row.id))
          return "error-answer-single-test-report"
        else if (this.test.rightAnswer.some((e) => e === row.id))
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
