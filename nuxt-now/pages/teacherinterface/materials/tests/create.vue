<template>
  <div>
    <el-select v-model="type" class="test-type-select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-card>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <i class="el-icon-tickets" />
        </b-input-group-prepend>
        <b-form-input
          v-model="title"
          type="text"
          :state="validationTitleState"
          placeholder="Название теста"
          trim
          @blur="validateTitle"
        />
        <b-form-invalid-feedback :state="validationTitleState">
          {{ invalidFeedbackTitle }}!
        </b-form-invalid-feedback>
      </b-input-group>
      <b-form-text v-if="validationTitleState || validationTitleState === null">
        Заголовок теста должен быть от 3 до 70 символов
      </b-form-text>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <i class="el-icon-edit" />
        </b-input-group-prepend>
        <b-form-input
          v-model="task"
          type="text"
          :state="validationTaskState"
          placeholder="Задание"
          trim
          @blur="validateTask"
        />
        <b-form-invalid-feedback :state="validationTaskState">
          {{ invalidFeedbackTask }}!
        </b-form-invalid-feedback>
      </b-input-group>
      <b-form-text v-if="validationTaskState || validationTaskState === null">
        Задание должно быть от 10 до 700 знаков (скоро будут возможность
        добавления картинок)
      </b-form-text>
      <b-button v-if="toTaskId" variant="info" @click="viewTest">
        К просмотру задания
      </b-button>
      <SingleTest
        v-if="type === 'one-answer'"
        :loading="loading"
        @save-test="saveTest"
      />
      <MiltyTest
        v-else-if="type === 'milty-answer'"
        :loading="loading"
        @save-test="saveTest"
      />
      <OpenAnswer
        v-else-if="type === 'open-answer'"
        :loading="loading"
        @save-test="saveTest"
      />
    </el-card>
  </div>
</template>

<script>
import eventBus from "@/plugins/eventBus"
import SingleTest from "@/components/tests/SingleTest"
import MiltyTest from "@/components/tests/MultyAnswer"
import OpenAnswer from "@/components/tests/OpenAnswer"
export default {
  name: "Create",
  layout: "teacher",
  middleware: "authTeacher",
  components: {
    OpenAnswer,
    SingleTest,
    MiltyTest,
  },
  data() {
    return {
      title: "",
      task: "",
      type: "one-answer",
      options: [
        {
          value: "one-answer",
          label: "Тест с одним правильным ответом",
        },
        {
          value: "milty-answer",
          label: "Тест с несколькими правильными ответами",
        },
        {
          value: "open-answer",
          label: "Задание с открытым ответом",
        },
      ],
      validate: {
        title: 0,
        task: 0,
      },
      loading: false,
      toTaskId: null,
    }
  },

  computed: {
    validationTitleState() {
      if (this.validate.title === 0) return null
      else if (this.validate.title === 1) return true
      return false
    },
    validationTaskState() {
      if (this.validate.task === 0) return null
      else if (this.validate.task === 1) return true
      return false
    },
    invalidFeedbackTitle() {
      if (this.validate.title === 2) return "Введите название теста"
      else if (this.validate.title === 3)
        return "Название теста слишком короткое"
      else if (this.validate.title === 4)
        return "Название теста слишком длинное"
    },
    invalidFeedbackTask() {
      if (this.validate.task === 2) return "Задание не может быть пустым"
      else if (this.validate.task === 3) return "Задание слишком короткое"
      else if (this.validate.task === 4) return "Задание слишком длинное"
    },
  },

  methods: {
    async saveTest(data) {
      let type
      if (this.type === "one-answer") type = 1
      else if (this.type === "milty-answer") type = 2
      else if (this.type === "open-answer") type = 3
      await this.validateTask()
      await this.validateTitle()
      if (this.validationTitleState && this.validationTaskState) {
        this.loading = true
        const result = await this.$store.dispatch("teacher/test/createTest", {
          title: this.title,
          task: this.task,
          type: type,
          answerChoice: data.tests,
          rightAnswer: data.answer,
        })
        const { _id, code } = result
        if (code) {
          let message
          const title = "Ошибка"
          switch (code) {
            case 1:
              message = "Ошибка заголовка или задания"
              break
            case 2:
              message = "Тип задания не указан"
              break
            case 3:
              message = "Ошибка в вводе вариантов ответа"
              break
            case 4:
              message = "Ошибка в вводе правильного ответа"
              break
            default:
              message = "Неизвестная ошибка"
              break
          }
          this.$notify.error({ title, message })
        } else if (_id) {
          this.toTaskId = _id
          this.clearTest()
          this.$notify.success({
            message: "Успех",
            title: "Тест успешно создан",
          })
        }
        this.loading = false
      } else {
        this.$notify.error({
          message: "Проверьте введенные данные",
          title: "Ошибка при создании",
        })
      }
    },
    validateTitle() {
      if (this.title.length === 0) this.validate.title = 2
      else if (this.title.length < 3) this.validate.title = 3
      else if (this.title.length > 70) this.validate.title = 4
      else this.validate.title = 1
    },
    validateTask() {
      if (this.task.length === 0) this.validate.task = 2
      else if (this.task.length < 10) this.validate.task = 3
      else if (this.task.length > 700) this.validate.task = 4
      else this.validate.task = 1
    },
    clearTest() {
      eventBus.$emit("clear-create-test-teacher")
      this.title = ""
      this.task = ""
      this.validate.title = 0
      this.validate.task = 0
    },
    viewTest() {
      this.$router.push(`/teacherinterface/materials/tests/${this.toTaskId}`)
    },
  },
}
</script>

<style scoped>
.test-type-select {
  min-width: 400px;
}
</style>
