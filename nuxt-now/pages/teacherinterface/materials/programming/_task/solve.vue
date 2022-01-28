<template>
    <mdb-container>
        <mdb-card>
            <mdb-card-body>
                <mdb-container v-if="task">
                    <mdb-stepper
                            simpleH
                            :options="options"
                            :steps="steps"
                            validation
                            buttons
                            :validatedSteps="validatedSteps"
                            @submit="$router.push(`/teacherinterface/materials/programming/${task._id}/view`)"
                            ref="stepper"
                    >

                        <template #1>
                            <Input
                                    @to-next-stage="$refs.stepper.changeActiveStep(2)"
                                    ref="inputTask"
                                    :task="task"
                                    @add-input="addNonAutoInput"
                                    @add-auto-input="addAutoInput"
                                    @reload-task="loadTask(true)"
                            />
                        </template>

                        <template #2>
                            <TaskResolve
                                    :task="task"
                                    @reload-task="loadTask(true)"
                            />
                        </template>
                    </mdb-stepper>
                </mdb-container>
                <mdb-container v-else>
                    <div class="ph-item">
                        <div class="ph-col-12">
                            <div class="ph-picture"></div>
                        </div>
                    </div>
                </mdb-container>

            </mdb-card-body>
        </mdb-card>
    </mdb-container>
</template>

<script>
import Input from "@/components/teacher/programming/secondStage/Input"
import TaskResolve from "@/components/teacher/programming/secondStage/TaskResolve"
export default {
  name: "Solve",
  layout: "teacher",
  middleware: "authTeacher",

  validate({ params }) {
    return /^\d+$/.test(params.task)
  },

  components: { Input, TaskResolve },

  data() {
    return {
      steps: [
        {
          name: 'Входные тесты',
        },
        {
          name: 'Решение задачи',
        },
      ],
        options: {
            stepBtn: {color: "info", active: "amber", iconClass: "white-text"},
            nextBtn: {outline: "info", icon: "chevron-right", text: 'К следующему шагу', show: false},
            submitBtn: {color: "amber", icon: "check", text: 'К просмотру задания', show: true},
            lineColor: "amber"
        },

    }
  },

  computed: {
    task() {
      return this.$store.getters["teacher/programming/task/task"](this.$route.params.task)
    },
      validatedSteps(){
          if (!this.task || !this.task.input || this.task.input.length === 0) return {1: false, 2:false};
          if (!this.task.solved) return {1: true, 2:false};
          return {1: true, 2:true};
      }
  },

  async mounted() {
    await this.loadTask();
    await this.validateTask();
    this.setDefaultStep();
  },

  methods:{
    async loadTask(force = false){
      await this.$store.dispatch("teacher/programming/task/loadTask", {
        taskId: this.$route.params.task, force
      })
    },
    async addNonAutoInput(data){
      if (!this.task) return console.error('Задача не загружена!');

      const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/addInput", {
        taskId: this.task._id,
        input: data.input
      });

      if (error && errorMessage) return this.$notify.error({
        title: 'Ошибка при добавлении',
        message: errorMessage
      });
      else {
        this.loadTask(true);
          this.$refs.stepper.changeActiveStep(2);
        return this.$notify.success({
          title: 'Успех',
          message: 'Входные параметры успешно добавлены'
        });

      }
    },
    async addAutoInput(data){
      if (!this.task) return console.error('Задача не загружена!');

      const { error, errorMessage } = await this.$store.dispatch("teacher/programming/attemp/addInput", {
        taskId: this.task._id,
        program: data.program,
        programLang: data.programLang,
        input: data.countTests,
      });
      const title = 'Ошибка при добавлении программы';
      if ( error && errorMessage ) this.$notify.error({ title, message: errorMessage});
      else if (error) this.$notify.error({ title, message: 'Неизвестная ошибка'});
      this.loadTask(true);
      await this.$refs.inputTask.reloadAttemps(true);
    },
    validateTask(){
      if (!this.task || !this.task.title || !this.task.task) return this.$router.push(`/teacherinterface/materials/programming/${this.$route.params.task}/view`)
    },
    setDefaultStep(){
        if ( this.task && this.task.input && this.task.input.length > 0 ) this.$refs.stepper.changeActiveStep(2)
    },


  }
}
</script>

<style scoped></style>
