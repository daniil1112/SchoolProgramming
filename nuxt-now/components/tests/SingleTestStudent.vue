<template>
  <el-card>
    <b>Задание номер {{ index }}</b>
    <p>Выберите один правильный ответ</p>
    <h4>{{ test.title }}</h4>
    <p>{{ test.task }}</p>
    <div>
      <el-table :data="test.answerChoice">
        <el-table-column label="Ответ" prop="answer" />
        <el-table-column>
          <template slot-scope="scope">
            <el-button v-if="answer === scope.row.id" @click="unsetAnswer">
              Отменить ответ
            </el-button>
            <el-button v-else @click="setAnswer(scope)">
              Выбрать вариант
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "SingleTestStudent",
  props: ["index", "test", "answers"],
  data() {
    return {
      answer: null,
    }
  },
  mounted() {
    if (this.answers) this.answer = this.answers
  },
  methods: {
    setAnswer({ row }) {
      this.answer = row.id
      this.$emit("update-answer", {
        index: this.index,
        answer: this.answer,
      })
    },
    unsetAnswer() {
      this.answer = null
      this.$emit("update-answer", {
        index: this.index,
        answer: this.answer,
      })
    },
  },
}
</script>

<style scoped></style>
