<template>
  <el-card>
    <b>Задание номер {{ index }}</b>
    <p>Выберите один правильный ответ</p>
    <h4>{{ test.title }}</h4>
    <p>{{ test.task }}</p>
    <div>
      <el-input v-model="answer" placeholder="Ответ" @change="changeAnswer" />
    </div>
  </el-card>
</template>

<script>
export default {
  name: "OpenAnswerTest",
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
    changeAnswer() {
      this.$emit("update-answer", {
        index: this.index,
        answer: this.answer,
      })
    },
  },
}
</script>

<style scoped></style>
