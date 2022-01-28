<template>
  <div>
    <el-card>
      <p>Тест с одним правильным ответом</p>
      <h4>{{ test.title }}</h4>
      <p>{{ test.task }}</p>

      <el-alert
        v-if="answer && answer === test.rightAnswer"
        title="Верный ответ"
        :description="getAlertText"
        type="success"
        show-icon
      />
      <el-alert
        v-else-if="answer && answer !== test.rightAnswer"
        title="Ответ неверный"
        :description="getAlertText"
        type="error"
        show-icon
      />
      <el-alert
        v-else
        title="Ответ не был получен"
        :description="getAlertText"
        type="warning"
        show-icon
      />

      <v-banner>
        <p>Ваш ответ:</p>
      </v-banner>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "OpenAnswerReport",
  props: ["test", "answer"],

  computed: {
    getAlertText() {
      if (this.answer && this.answer === this.test.rightAnswer)
        return `Ваш ответ: ${this.answer}`
      if (this.answer && this.answer !== this.test.rightAnswer)
        return `Ваш ответ: ${this.answer}. Правильный ответ: ${this.test.rightAnswer}`
      return `Правильный ответ: ${this.test.rightAnswer}`
    },
  },
}
</script>
