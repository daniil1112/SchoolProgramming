<template>
  <div>
    <Task v-if="stage > 1" :task="task" />
    <LoadingTask v-else />
    <div v-if="!verdictID">
      <Samples v-if="stage > 1 && task.samples" :samples="task.samples" />
      <MainVerdict
        v-if="(stage > 2 && !verdictTask.empty) || !addAttemps"
        :verdict="verdictTask"
      />
      <div v-if="!ended && !(groupTask.options.onlyOneSuccessAttemp && successAttemp)">
        <programming-with-template
                v-if="task && stage > 1 && task.type===2 "
                :template="task.template"
                :language="languages[0]"
                :attemps="attemps"
                :attempsLeft="groupTask.options.maxAttemps - attemps.length"
                @add-attemp="addTemplateAttemp"
        />
        <Code
                v-show="stage > 4"
                v-if="task && task.type===1 && addAttemps "
                :attemps="attemps"
                :attempsLeft="groupTask.options.maxAttemps - attemps.length"
                @add-attemp="addAttemp"
        />
        <small v-show="stage > 4">Отсалось попыток: {{groupTask.options.maxAttemps - attemps.length}}</small>
        <LoadingCodeField v-if="stage <= 4" />
      </div>

      <Attemps
        v-if="stage > 3 && attemps"
        :attemps="attemps"
        verdict-return="id"
        @to-verdict="openVerdictAttemp"
      />
      <loading-attemps v-else />
    </div>
    <AttempVerdict
      v-if="verdictID"
      :id="verdictID"
      :program-lang="verdictAttemp.programLang"
      :groupTask="groupTask"
      :program="verdictAttemp.program"
      :verdict="verdictAttemp.verdict"
      @totask="verdictID = null"
    />
  </div>
</template>

<script>
import { mapState } from "vuex"

import AttempVerdict from "./student/tasks/programming/AttempVerdict"
import Code from "./student/tasks/programming/Code"
import MainVerdict from "./student/tasks/programming/MainVerdict"
import Task from "./student/tasks/programming/Task"
import Attemps from "./student/tasks/programming/Attemps"
import LoadingTask from "./student/tasks/programming/LoadingTask"
import Samples from "./student/tasks/programming/Samples"
import eventBus from "../plugins/eventBus"
import LoadingAttemps from "./student/tasks/programming/LoadingAttemps"
import LoadingCodeField from "./student/tasks/programming/LoadingCodeField"
import ProgrammingWithTemplate from "./student/programming/programming-with-template";
export default {
  name: "NewProgrammingTask",
  components: {
    ProgrammingWithTemplate,
    LoadingCodeField,
    LoadingAttemps,
    Samples,
    LoadingTask,
    Attemps,
    Task,
    MainVerdict,
    Code,
    AttempVerdict,
  },
  props: ["id", "groupTask"],
  data() {
    return {
      timeout: null,
      dateInterval: null,
      verdictID: null,
      stage: 1,
      now: new Date(),
    }
  },

  computed: {
    timestamp() {
      return parseInt(new Date(new Date().toISOString()).getTime() / 1000)
    },
    ended(){
      return this.now > new Date(this.groupTask.stopTime)
    },
    attemps() {
      return this.$store.getters["student/programming/attemp/attemps"](
        this.groupTask._id
      )
    },
    languages(){
      if (this.task){
        return this.$store.getters["student/programming/languages/languages"](
                this.task.langs
        )
      }

    },
    maxStudentPointsAttemps() {
      return this.$store.getters[
        "student/programming/attemp/maxStudentPointsAttemps"
      ](this.groupTask._id)
    },
    addAttemps() {
      return !(
        (this.groupTask.onlyOneSuccessAttemp &&
          this.verdictTask &&
          !this.verdictTask.empty &&
          this.verdictTask.verdict.points ===
            this.verdictTask.verdict.maxPoints) ||
        this.now > new Date(this.groupTask.stopTime)
      )
    },
    task() {
      return this.$store.getters["student/programming/task/task"](this.id)
    },
    verdictTask() {
      return this.$store.getters["student/report/report"](this.groupTask._id)
    },
    verdictAttemp() {
      return this.attemps.find((e) => e._id === this.verdictID)
    },
    successAttemp(){
      let attemps = this.attemps.filter ( e => e.verdict);
      return attemps.some (e => e.points === e.maxPoints);
    }
  },
  async mounted() {
    await this.loadTask()
    await this.loadLangs()
    this.stage = 2
    await this.$store.dispatch("student/report/loadReport", {
      taskId: this.$route.params.task,
    })
    this.stage = 3
    await this.loadAttemps(true)
    this.stage = 4
    this.setCodeAndLang()
    this.setIntervalUpdateDate()
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timeout)
    if (this.dateInterval) clearInterval (this.dateInterval )
  },

  methods: {
    setIntervalUpdateDate(){
      if (!this.dateInterval) this.dateInterval = setInterval(() => {
        this.now = null
        this.now = new Date()
      }, 2000)
    },
    async loadTask() {
      await this.$store.dispatch("student/programming/task/loadTask", {
        taskId: this.id,
      })
    },
    loadLangs: async function(){
      await this.$store.dispatch("student/programming/languages/loadLanguages", {
        taskId: this.id,
      });
    },
    async loadAttemps(first = false) {
      await this.$store.dispatch("student/programming/attemp/loadAttemps", {
        groupTask: this.groupTask._id,
      })

      if (
        this.attemps.length > 0 &&
        this.attemps.some(
          (element) =>
            element.status === "waiting" || element.status === "compiling"
        )
      ) {
        setTimeout(this.loadAttemps, 5000)
      } else if (!first) {
        if (
          !this.verdictTask ||
          this.verdictTask.empty ||
          (!isNaN(this.verdictTask.points) &&
            this.verdictTask.points !== this.maxStudentPointsAttemps)
        ) {
          this.reloadVerdictTask()
        }
      }
    },
    async addAttemp(data) {
      const program = data.program
      const programLang = data.programLang

      if (
        !this.attemps.some(
          (element) =>
            element.status === "waiting" || element.status === "compiling"
        )
      ) {
        const status = await this.$store.dispatch(
          "student/programming/attemp/addAttemp",
          {
            taskId: this.groupTask.task,
            program: program,
            programLang: programLang,
            type: this.type,
            groupTask: this.groupTask._id,
          }
        )

        if (status) {
          await this.loadAttemps()
        }
      }
    },

    async addTemplateAttemp(data){
      const {programmingText} = data

      if (
              !this.attemps.some(
                      (element) =>
                              element.status === "waiting" || element.status === "compiling"
              )
      ) {
        const status = await this.$store.dispatch(
                "student/programming/attemp/addTemplateAttemp",
                {
                  taskId: this.groupTask.task,
                  groupTask: this.groupTask._id,
                  programmingText
                }
        )

        if (status) {
          await this.loadAttemps()
        }
      }
    },
    async reloadVerdictTask() {
      await this.$store.dispatch("student/report/reloadReport", {
        taskId: this.$route.params.task,
      })
    },
    openVerdictAttemp(data) {
      this.verdictID = data.verdictID
    },
    async setCodeAndLang() {
      if (this.attemps && this.addAttemps) {
        let sorted = Object.assign([], this.attemps)
        sorted.sort((prev, next) => next._id - prev._id)
        const lastAttemp = sorted[0]
        if (lastAttemp) {
          eventBus.$emit("set-default-code-lang", {
            program: lastAttemp.program,
            programLang: lastAttemp.programLang,
          })
        }
        this.stage = 5

      }
    },
  },
}
</script>

<style scoped></style>
