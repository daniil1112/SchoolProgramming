<template>
  <div>
      <h1>Входные тесты</h1>
    <el-switch
      v-model="autoInput"
      active-text="Автоматический ввод"
      inactive-text="Ручной ввод"
    />
    <div v-if="autoInput">
        <AutoInput
            @to-next-stage = "$emit('to-next-stage')"
            :taskInput="taskInput"
            :compiling="compiling"
            :lastAttemp="lastAttemp"
            @add-input="compileInputProgram"
        />
    </div>
      <ManualInput v-else
              :taskInput="taskInput"
              :compiling="compiling"
              @add-input="pushInput"
      />
    <ModalWindow v-if="compiling">
        <template v-slot:header>
            Обработка автоматического ввода
        </template>
        <template v-slot:body>
            <AttempsTable
                :attemps="[lastAttemp]"
                :visibleButton="false"
                :visibleErrorTest="false"
                :visibleVerdict="false"
            />
        </template>
    </ModalWindow>
  </div>
</template>

<script>
import AttempsTable from "@/components/programming/AttempsTable"
import InputProgram from "@/components/programming/InputProgram"
import ModalWindow from "../../../ModalWindow";
import ManualInput from "./ManualInput";
import AutoInput from "./AutoInput";
export default {
  name: "Input",
  components: {
      AutoInput,
      ManualInput,
    ModalWindow,
    AttempsTable,
    InputProgram,
  },
  props: ["task"],
  data: function () {
    return {
      autoInput: false,
      timeout: []
    }
  },
  computed: {
    taskId(){
        if (this.task && this.task._id) return this.task._id;
    },
    prismLang() {
      if (this.programLang === 1) return "pascal";
      else if (this.programLang === 2) return "python"
    },
    inputLength() {
      if (this.task.input) {
        if (this.task.input.length > 0) return true
      }
      return false
    },
    taskInput(){
      if (this.task && this.task.input && this.task.input.length > 0) return this.task.input;
      return []
    },
    attempsTask(){
      if (this.task){
        return this.$store.getters["teacher/programming/attemp/attempsInput"](this.task._id)
      }
      return []
    },
    compiling(){
      return this.attempsTask.some( e => e.status !== 'compiled')
    },
    taskSolved(){
      if (this.task) return this.task.solved;
      return false
    },
      lastAttemp(){
        if (this.attempsTask.length === 0) return null;
        return this.attempsTask[this.attempsTask.length - 1]
      }
  },

  async mounted() {
    await this.loadAttemps();
  },
  methods: {
    async compileInputProgram(data) {
        let {taskSolved,taskInput, program,programLang, countTests} = data;
        if (taskSolved){
            this.$confirm('Изменить входные данные? Решение задачи прийдется переделать. Старые данные будут утеряны').then(async _ => {
                await this.$emit('add-auto-input',{program, programLang, countTests});
                await this.$emit('clear-solved');
            })
        } else if (taskInput){
            await this.$emit('add-auto-input',{program, programLang, countTests})
        } else {
            await this.$emit('add-auto-input',{program, programLang, countTests});
        }
    },
    async pushInput(data) {
      let {input} = data;
      if (this.taskSolved) {
        this.$confirm('Изменить входные данные? Решение задачи прийдется переделать. Старые данные будут утеряны').then(async _ => {
          await this.$emit('add-input',{input});
        })
      } else if ( this.taskInput.length > 0 ) this.$confirm('Изменить входные данные? Старые дынные будут утеряны').then(async _ => {
          await this.$emit('add-input',{input});
      });
      else await this.$emit('add-input',{input});
    },

    async loadAttemps() {
      const {error, errorMessage} = await this.$store.dispatch("teacher/programming/attemp/loadInputAttemps", {
        taskId: this.taskId,
      });
      if (error && errorMessage){
        this.$notify.error({
          title: ' Произошла ошибка ',
          message: errorMessage
        })
      }
      if (this.compiling) {
        this.timeout.push(setTimeout(this.reloadAttemps, 5000));
      }

    },
      async reloadAttemps(timeout = false){
          if (timeout){
              if (this.compiling) this.timeout.push(setTimeout(this.reloadAttemps, 5000));
          } else {
              const {solved} = await this.$store.dispatch("teacher/programming/attemp/reloadInputAttemps", {
                  taskId: this.taskId,
              });
              if (solved) {
                  this.$notify.success({
                      title: 'Входные данные добавлены',
                      message: 'Вы можете переходить к следующему шагу или отредактировать входные тесты вручную'
                  });
                  this.$emit('reload-task');
              }

              if (this.compiling) this.timeout.push(setTimeout(this.reloadAttemps, 5000));
          }
      },
  },
  destroyed() {
    this.timeout.forEach( e => clearTimeout(e));
  }
}
</script>

<style scoped>


</style>
