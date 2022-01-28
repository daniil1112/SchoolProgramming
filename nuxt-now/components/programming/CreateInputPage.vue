<template>
  <div>
    <el-switch
      v-model="autoInput"
      active-text="Автоматический ввод"
      inactive-text="Ручной ввод"
    />
    <div v-if="autoInput">
      <div>
        Количество тестов:
        <el-input-number
          v-model="countTests"
          :min="1"
          :max="100"
          controls-position="right"
        />
      </div>
      Введите програму
      <input-program
        :compiling="compiling"
        @export-program="compileInputProgram"
      />
    </div>
    <div v-else>
      Введите вручную
      <el-button type="primary" @click="addInput">
        Добавить тест
      </el-button>
      <div class="program-input">
        <div v-for="(element, index) in input">
          <b-input
            v-model="input[index]"
            placeholder="Входные параметры"
            trim
          />
          <el-button type="danger" @click="deleteInput(index)">
            Удалить тест
          </el-button>
        </div>
      </div>
      <el-button v-if="input.length > 0" type="primary" @click="pushInput">
        Сохранить
      </el-button>
    </div>
    <div v-if="task">
      {{ task.input }}
      <el-button
        v-if="inputLength && !compiling"
        type="primary"
        @click="toNextStage"
      >
        К следующему шагу
      </el-button>
    </div>
    <!--        TODO УЧИТЕЛЬСКИЕ ПОПЫТКИ-->
    <!--        <AttempsTable-->
    <!--                :attemps="attemps"-->
    <!--                page="/teacherinterface/materials/programming/verdict/"-->
    <!--        ></AttempsTable>-->
  </div>
</template>

<script>
import "prismjs"
import PrismEditor from "vue-prism-editor"
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-pascal"
import "prismjs/components/prism-python"
import "vue-prism-editor/dist/VuePrismEditor.css"
import AttempsTable from "@/components/programming/AttempsTable"
import InputProgram from "@/components/programming/InputProgram"
export default {
  name: "Input",
  components: {
    PrismEditor,
    AttempsTable,
    InputProgram,
  },
  data: function () {
    return {
      type: "teacher",
      autoInput: false,
      countTests: 1,
      programLang: 1,
      input: [],
      programLangSelect: [
        {
          value: 1,
          label: "PascalABCNet",
        },
        {
          value: 2,
          label: "Python 3",
        },
      ],
      code: "",
      compiling: true,
      attemps: null,
    }
  },
  computed: {
    prismLang() {
      if (this.programLang === 1) return "pascal"
      else if (this.programLang === 2) return "python"
    },
    task() {
      return this.$store.getters["programming/task/task"]
    },
    inputLength() {
      if (this.task.input) {
        if (this.task.input.length > 0) return true
      }
      return false
    },
  },

  async mounted() {
    await this.loadAttemps()
    await this.loadTask()
  },
  methods: {
    addInput() {
      this.input.push("")
    },
    deleteInput(index) {
      this.input.splice(index, 1)
    },

    async compileInputProgram(options) {
      const result = await this.$axios.post(
        "api/teacher/programming/loadInput",
        {
          taskId: this.$route.params.task,
          program: options.program,
          programLang: options.programLang,
          input: this.countTests,
          type: "auto",
        }
      )
      this.compiling = true
      setTimeout(this.loadAttemps, 5000)
    },
    async pushInput() {
      if (this.input.length > 0) {
        const { input } = (
          await this.$axios.post("api/teacher/programming/addInput", {
            taskId: this.$route.params.task,
            input: this.input,
          })
        ).data
        await this.loadTask()
      }
    },
    async loadAttemps() {
      const result = await this.$axios.post(
        "api/teacher/programming/loadAttempsInput",
        {
          taskId: this.$route.params.task,
        }
      )
      let isCompiling = result.data.attemps.some(
        (element) =>
          element.status === "waiting" || element.status === "compiling"
      )
      this.compiling = isCompiling
      if (isCompiling) {
        setTimeout(this.loadAttemps, 5000)
      } else {
        if (this.task) {
          await this.loadTask()
        }
      }
      if (result.data.attemps) {
        this.attemps = result.data.attemps
      }
    },
    async loadTask() {
      await this.$store.dispatch("programming/task/loadTask", {
        taskId: this.$route.params.task,
        type: this.type,
      })
    },
    toNextStage() {
      if (this.task) {
        if (!this.isCompiling && this.task.input) this.$emit("change-stage")
      }
    },
  },
}
</script>

<style scoped></style>
