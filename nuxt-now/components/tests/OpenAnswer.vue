<template>
  <div>
    <b-input-group class="mb-2">
      <b-form-input
        v-model="answer"
        placeholder="Ответ"
        :state="validationAnswerState"
        trim
        @blur="validateAnswer"
        @change="validateAnswer"
        @keypress.enter.native="save"
      />
      <b-form-invalid-feedback :state="validationAnswerState">
        {{ invalidFeedbackAnswer }}!
      </b-form-invalid-feedback>
    </b-input-group>
    <b-overlay
      :show="loading"
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block"
    >
      <b-button
        variant="outline-success"
        :disabled="loading || !validationAnswerState"
        @click="save"
      >
        Сохранить тест
      </b-button>
    </b-overlay>
  </div>
</template>

<script>
import eventBus from "@/plugins/eventBus"
export default {
  name: "OpenAnswer",
  props: ["loading"],
  data() {
    return {
      answer: "",
      validate: {
        answer: 0,
      },
    }
  },

  computed: {
    validationAnswerState() {
      if (this.validate.answer === 0) return null
      else if (this.validate.answer === 1) return true
      return false
    },
    invalidFeedbackAnswer() {
      if (this.validate.answer === 2) return "Введите ответ"
      return ""
    },
  },

  mounted() {
    eventBus.$on("clear-create-test-teacher", (_) => {
      this.answer = ""
      this.validate.answer = 0
    })
  },

  methods: {
    save() {
      this.validateAnswer()
      if (this.validationAnswerState)
        this.$emit("save-test", {
          type: "open-answer",
          tests: null,
          answer: this.answer,
        })
      else
        return this.$notify.error({
          title: "Ошибка",
          message: "Проверьте введенные данные",
          duration: 1000,
        })
    },
    validateAnswer() {
      if (this.answer.length === 0) this.validate.answer = 2
      else this.validate.answer = 1
    },
  },
}
</script>

<style scoped></style>
