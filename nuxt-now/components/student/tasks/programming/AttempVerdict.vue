<template>
  <div>
    <div v-if="verdict">
      <div v-if="program">
        <span>Програма:</span>
        <Prism
          :language="prismLang"
          class="line-numbers"
          :code="program"
          placeholder="Программа"
          autosize
        />
      </div>
      <div v-if="!verdict.compilation">
        <el-alert type="danger">
          Compilation error!
        </el-alert>
        <div v-if="verdict.compilationMSG">
          <span v-html="verdict.compilationMSG" />
        </div>
      </div>
      <div v-else>
        <el-alert type="success">
          Compilation success!
        </el-alert>
      </div>
      <div v-if="verdict.compilation">
        <span>Количество баллов: <span v-html="verdict.points" /></span>
        <span>Максимально баллов: <span v-html="verdict.maxPoints" /></span>
        <attemp-verdict-table
          :verdict="verdict"
          :visible-compiler-answer="groupTask.options.visibleCompilerAnswer"
          :visible-tests="groupTask.options.visibleTests"
          :attemp-id="id"
          :group-task="groupTask._id"
          :visible-tests-table="groupTask.options.visibleTestsTable"
        />
      </div>
    </div>
    <el-button type="info" @click="$emit('totask')">
      Вернуться к задачам
    </el-button>
    <loading-program :program-lang="programLang" />
  </div>
</template>

<script>
import Prism from "vue-prismjs"
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-pascal"
import "prismjs/components/prism-python"
import AttempVerdictTable from "./AttempVerdictTable"
import LoadingProgram from "./loadingProgram"
export default {
  name: "AttempVerdict",
  components: {
    LoadingProgram,
    AttempVerdictTable,
    Prism,
  },
  props: ["id", "groupTask", "programLang", "program", "verdict"],
  computed: {
    prismLang() {
      if (this.programLang === 1) return "pascal"
      else if (this.programLang === 2) return "python"
      else return "pascal"
    },
  },
}
</script>

<style scoped></style>
