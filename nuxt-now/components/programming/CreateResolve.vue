<template>
  <div>
    <div v-if="loaded">
      <el-steps simple>
        <el-step title="Создание тестов" icon="el-icon-edit" status="success" />
        <el-step
          title="Подтверждение задания"
          icon="el-icon-upload"
          status="process"
        />
        <el-step title="Подтвердить результат" icon="el-icon-picture" />
      </el-steps>
      <div v-if="!solved">
        <div>
          <span>Язык програмирования</span>
          <el-select
            v-model="ProgramForm.programLang"
            placeholder="Programming language"
          >
            <el-option
              v-for="item in programLangSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="program-resolve">
          <client-only>
            <prism-editor
              ref="prismEditorRef"
              :language="prismLang"
              :line-numbers="true"
              placeholder="Программа"
              autosize
              class="prism-editor-single"
            />
          </client-only>
        </div>
        <div class="program-input">
          <div v-for="(input, index) in ProgramForm.input">
            <el-input
              v-model="ProgramForm.input[index]"
              type="textarea"
              autosize
              placeholder="Входные параметры"
            />
          </div>
        </div>
        <div v-if="!isCompiling" class="add-input-label">
          <el-button v-if="!isCompiling" @click="ProgramForm.input.push('')">
            Добавить вводимый тест
          </el-button>
        </div>
        <div>
          <el-button
            v-if="!isCompiling"
            type="success"
            :loading="compiling"
            @click="confirmProgram"
          >
            Подтвердить задание
          </el-button>
        </div>
      </div>
      <div v-else>
        <span>Решено!</span>
        <div class="solved-attemp">
          <span> Входные параметры</span>
          <div v-for="input in solvedAttempOBJ.input">
            <el-input
              type="textarea"
              autosize
              placeholder="Входные параметры"
              :value="input"
            />
          </div>
          <span> Выходные параметры</span>
          <div v-for="output in solvedAttempOBJ.output">
            <el-input
              type="textarea"
              autosize
              placeholder="Входные параметры"
              :value="output"
            />
            />
          </div>
          <span> Ограничения по времени</span>
          <div v-for="(time, index) in solvedAttempOBJ.time">
            <el-input
              type="textarea"
              autosize
              placeholder="Входные параметры"
              :value="Math.round(time * 1.2)"
            />
          </div>
          <div class="program-resolve">
            <client-only>
              <prism-editor
                ref="prismEditorRef"
                readonly="true"
                :code="solvedAttempOBJ.program"
                :language="prismLangSuccessAttemp"
                :line-numbers="true"
                placeholder="Решение"
                autosize
                class="prism-editor-single"
              />
            </client-only>
          </div>
        </div>
      </div>
      <el-button v-if="!isCompiling" type="primary" @click="toPrevStage">
        К предыдущему шагу
      </el-button>
      <div>
        <AttempsTable
          :attemps="attemps"
          page="/teacherinterface/materials/programming/verdict/"
        />
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
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
export default {
  name: "CreateResolve",

  components: {
    PrismEditor,
    AttempsTable,
  },

  data: function () {
    return {
      ProgramForm: {
        programLang: 1,
      },
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
      loaded: false,
      visibleAttemps: false,
      isCompiling: false,
      timeout: null,
      type: "teacher",
    }
  },

  computed: {
    prismLang() {
      if (this.ProgramForm.programLang === 1) return "pascal"
      else if (this.ProgramForm.programLang === 2) return "python"
      return "pascal"
    },
    prismLangSuccessAttemp() {
      if (this.solvedAttempOBJ.programLang === 1) return "pascal"
      else if (this.solvedAttempOBJ.programLang === 2) return "python"
    },
    attemps() {
      return this.$store.getters["programming/attemp/attemps"]
    },
    solved() {
      return this.$store.getters["programming/task/solved"]
    },
    solvedAttemp() {
      return this.$store.getters["programming/task/solvedAttemp"]
    },
    solvedAttempOBJ() {
      return this.$store.getters["programming/attemp/solvedAttemp"]
    },
    compiling() {
      return this.$store.getters["programming/attemp/attemps"].some(
        (attemp) => attemp.status === "compiling" || attemp.status === "waiting"
      )
    },
  },

  async mounted() {
    console.log("mounted")
    this.loaded = true
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    })
    await this.loadTask()
    await this.loadAttemps()
    await this.reloadAttemps()
    if (this.solved) {
      await this.loadSolvedAttemp()
    }
    this.loaded = true
    loading.close()
  },
  destroyed() {
    clearTimeout(this.timeout)
  },

  methods: {
    async loadSolvedAttemp() {
      await this.$store.dispatch(
        "programming/attemp/loadSolvedAttemp",
        this.solvedAttemp
      )
    },
    async loadAttemps() {
      await this.$store.dispatch("programming/attemp/loadAttemps", {
        taskId: this.$route.params.task,
        type: this.type,
      })
    },
    async loadTask() {
      await this.$store.dispatch("programming/task/loadTask", {
        taskId: this.$route.params.task,
        type: this.type,
      })
    },
    async reloadAttemps() {
      let isCompiling = this.attemps.some(
        (element) =>
          element.status === "waiting" || element.status === "compiling"
      )
      if (isCompiling) {
        await this.$store.dispatch("programming/attemp/loadAttemps", {
          taskId: this.$route.params.task,
          type: this.type,
        })
        if (
          this.attemps.some((attemp) => {
            if (attemp.verdict) {
              return (attemp.verdict.maxPoints === attemp.verdict.points) !== 0
            } else {
              return false
            }
          })
        ) {
          await this.loadTask()
          if (this.solved) {
            await this.loadSolvedAttemp()
          }
        }
        this.timeout = setTimeout(this.reloadAttemps, 10000)
      }
    },
    toVerdict({ row }) {
      this.$router.push(
        `/teacherinterface/materials/programming/verdict/${row._id}`
      )
    },
    statusBar({ row }) {
      if (row.status === "waiting") {
        return "el-icon-document-copy"
      } else if (row.status === "compiling") {
        return "el-icon-loading"
      } else {
        if (!row.verdict.compilation) return "el-icon-circle-close"
        else if (row.verdict.maxPoints === 0) return "el-icon-remove-outline"
        else if (row.verdict.errors) return "el-icon-remove-outline"
        else return "el-icon-circle-check"
      }
    },
    tableRowClassName({ row }) {
      if (row.status === "waiting" || row.status === "compiling") {
        return "waiting-row"
      } else {
        if (row.verdict) {
          if (
            !row.verdict.compilation ||
            row.verdict.maxPoints === 0 ||
            row.verdict.maxPoints !== row.verdict.points
          ) {
            return "error-row"
          } else return "success-row"
        }
      }
    },
    async confirmProgram() {
      const res = await this.$store.dispatch("programming/attemp/addAttemp", {
        type: "teacher",
        taskId: this.$route.params.task,
        program: this.$refs.prismEditorRef.codeData,
        programLang: this.ProgramForm.programLang,
      })
      if (res.data.success) {
        this.reloadAttemps()
      }
    },
    toPrevStage() {
      if (!this.isCompiling) this.$emit("change-stage-down")
    },
  },
}
</script>

<style scoped>
.icon-status {
  font-size: 30px;
}
</style>
