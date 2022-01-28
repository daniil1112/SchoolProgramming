<template>
  <mdb-card >
    <mdb-card-body>
      <mdb-stepper
              buttons
              :steps="steps"
              @submit="saveFirstStage"
              :options="options"
              validation
              :validatedSteps="validatedSteps"
              @validate="validate"
      >
        <template #1>
          <mdb-card-title tag="h3" class="text-center">Заголовок и задание</mdb-card-title>
          <TitleAndTask
                  :data="firstStep"
                  @next-stage="toSecondStep"
                  @title="setTitle"
                  @task="setTask"
          />
        </template>
        <template #2>
          <mdb-card-title  tag="h3" class="text-center">Примеры ввода/вывода</mdb-card-title>
          <Examples
                  :data="secondStep"
                  @next-stage="saveFirstStage"
                  @examples="setExamples"
          />
        </template>

      </mdb-stepper>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
import TitleAndTask from "@/components/teacher/programming/firstStage/TitleAndTask"
import Examples from "@/components/teacher/programming/firstStage/Examples"
export default {
  name: "Add",
  layout: "teacher",
  middleware: "authTeacher",
  components: { Examples, TitleAndTask },
  data() {
    return {
      step: 1,
      firstStep: {
        title: "",
        task: "",
      },
      secondStep: {
        examples: [],
      },

      steps: [
        { icon: "folder", far: true, name: "Заголовок и задание" },
        { icon: "pencil-alt", name: "Примеры ввода/вывода" },
      ],
      validatedSteps: {},
      options: {
        stepBtn: {color: "info", active: "amber", iconClass: "white-text"},
        nextBtn: {outline: "info", icon: "chevron-right", text: 'К следующему шагу'},
        prevBtn: {outline: "info", icon: "chevron-left", text: 'К предыдущему шагу'},
        submitBtn: {color: "amber", icon: "check", text: 'Создать'},
        lineColor: "amber"
      },
    }
  },

  methods: {
    setTitle(data){
      this.firstStep.title=data
    },
    setTask(data){
      this.firstStep.task=data
    },
    setExamples(data){
      this.secondStep.examples = data
    },

    toSecondStep(data) {
      this.firstStep = {
        title: data.title,
        task: data.task,
      }
      this.step = 2
    },
    async saveFirstStage () {
      const { id, code } = (
        await this.$axios.post("api/teacher/programming/newTask", {
          title: this.firstStep.title,
          task: this.firstStep.task,
          examples: this.secondStep.examples,
        })
      ).data;

      if (code) {
        switch (code) {
          case 1:
            this.$notify.error({
              title: "Ошибка при создании",
              message: "Ошибка в заголовке или задании!",
            })
            this.step = 1
            break
          case 2:
            this.$notify.error({
              title: "Ошибка при создании",
              message: "Ошибка в примерах ввода\\вывода!",
            })
            this.step = 2
            break
          default:
            break
        }
      } else if (id) {
        this.$notify.success({
          title: "Успех",
          message: "Задание создано!",
        })
        this.$router.push(`/teacherinterface/materials/programming/${id}/view`)
      }
    },
    validate(step) {
      if (step === 1) {
        this.validatedSteps[step] = this.firstStep.title.length >=3 && this.firstStep.task.length>=10
      } else {
        this.validatedSteps[step] = this.secondStep.examples.length > 0
      }
    },
  },
}
</script>

<style scoped>

</style>
