<template>
  <div>
      <mdb-input
              label="Заголовок"
              icon="pen"
              type="text"
              class="mb-5"
              required
              v-model="title"
              :isValid="validate.title === 1"
              :customValidation="validate.title > 0"
              :invalidFeedback="invalidFeedbackTitle"
              @change="validateTitle"
              trim
              counter
              counterMaxValue="70"
      />
      <mdb-input
              label="Задание"
              icon="edit"
              type="textarea"
              class="mb-5"
              required
              v-model="task"
              :isValid="validate.task === 1"
              :customValidation="validate.task > 0"
              :invalidFeedback="invalidFeedbackTask"
              @change="validateTask"
              trim
              counter
              counterMaxValue="500"
      />
    <!--        Можно будет даже тему впихнуть-->
  </div>
</template>

<script>
export default {
  name: "TitleAndTask",
  props: ["data"],
  data() {
    return {
      title: "",
      task: "",
      validate: {
        title: 0,
        task: 0,
      },
    }
  },

  computed: {
    invalidFeedbackTitle() {
      if (this.validate.title === 2) return "Введите название задачи"
      else if (this.validate.title === 3)
        return "Название задачи слишком короткое"
      else if (this.validate.title === 4)
        return "Название задачи слишком длинное"
    },
    invalidFeedbackTask() {
      if (this.validate.task === 2) return "Введите текст задачи"
      else if (this.validate.task === 3) return "Текст задачи слишком короткий"
      else if (this.validate.task === 4) return "Текст задачи слишком длинный"
    },
  },

  mounted() {
    const { title, task } = this.data
    this.title = title
    this.task = task
    if (this.title.length > 0) this.validateTitle()
    if (this.task.length > 0) this.validateTask()
  },

  methods: {
    validateTitle() {
      const title = this.title.trim()
      this.$emit('title',title)
      if (title.length === 0) return (this.validate.title = 2)
      else if (title.length < 3) return (this.validate.title = 3)
      else if (title.length > 70) return (this.validate.title = 4)
      else return (this.validate.title = 1)
    },
    validateTask() {
      const task = this.task.trim()
      this.$emit('task',task)
      if (task.length === 0) return (this.validate.task = 2)
      else if (task.length < 10) return (this.validate.task = 3)
      else if (task.length > 500) return (this.validate.task = 4)
      else return (this.validate.task = 1)
    },
  },
}
</script>

<style scoped></style>
