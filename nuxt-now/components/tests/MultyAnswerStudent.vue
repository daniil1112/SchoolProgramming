<template>
  <el-card>
    <b>Задание номер {{ index }}</b>
    <p>Выберите правильный(е) ответ(ы)</p>
    <h4>{{ test.title }}</h4>
    <p>{{ test.task }}</p>
    <p v-if="answers">
      {{ answers }}
    </p>
    <div>
      <el-table :data="test.answerChoice">
        <el-table-column label="Ответ" prop="answer" />
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              v-if="answer.some((element) => element === scope.row.id)"
              @click="unsetAnswer(scope)"
            >
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
  name: "MultyTestStudent",
  props: ["index", "test", "answers"],
  data() {
    return {
      answer: [],
    }
  },
  mounted() {
    if (this.answers) this.answer = this.answers
  },
  methods: {
    setAnswer({ row }) {
      this.answer.push(row.id)
      this.$emit("update-answer", {
        index: this.index,
        answer: this.answer,
      })
    },
    unsetAnswer({ row }) {
      this.answer = this.answer.filter((element) => element !== row.id)
      this.$emit("update-answer", {
        index: this.index,
        answer: this.answer,
      })
    },
  },
}
</script>

<style scoped></style>
