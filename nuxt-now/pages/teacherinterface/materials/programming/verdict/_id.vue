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
          data-download-link
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
        <span>Количество баллов: <span v-html="verdict.points" /></span>
        <span>Максимально баллов: <span v-html="verdict.maxPoints" /></span>
        <el-table :data="verdict.launchMSG" :row-class-name="tableRowClassName">
          <el-table-column label="Compiler">
            <template slot-scope="scope">
              <span v-html="scope.row" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-button type="info" @click="toTask">
      Вернуться к задачам
    </el-button>
    <div>
      Загрузить програму:
      <button @click="loadProgramFile">
        Загрузить!!!
      </button>
    </div>
  </div>
</template>

<script>
import Prism from "vue-prismjs"
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-pascal"
import "prismjs/components/prism-python"
export default {
  name: "Verdict",
  layout: "teacher",
  middleware: "authTeacher",
  components: {
    Prism,
  },
  data: function () {
    return {
      verdict: null,
      programLang: null,
      program: null,
    }
  },
  computed: {
    prismLang() {
      if (this.programLang === 1) return "pascal"
      else if (this.programLang === 2) return "python"
      else return "pascal"
    },
  },
  async mounted() {
    const result = await this.$axios.post(
      "https://server-now.moiplansh028.now.sh/api/teacher/programming/verdict",
      {
        programId: this.$route.params.id,
      }
    )
    this.verdict = result.data.verdict
    this.program = result.data.program
    this.programLang = result.data.programLang
  },

  methods: {
    toTask() {
      this.$router.go(-1)
    },
    tableRowClassName({ row, rowIndex }) {
      if (row === "OK") {
        return "success-row-verdict"
      } else {
        return "danger-row-verdict"
      }
    },
    loadProgramFile() {
      const val = this.program
      const download = document.createElement("a")
      download.href =
        "data:text/plain;content-disposition=attachment;filename=file," + val
      if (this.programLang === 1) download.download = "1.pas"
      else if (this.programLang === 2) download.download = "1.py"
      else download.download = "1.txt"
      download.style.display = "none"
      download.id = "download"
      document.body.appendChild(download)
      document.getElementById("download").click()
      document.body.removeChild(download)
    },
  },
}
</script>

<style scoped></style>
