<template>
  <div>
    <div>
      Загрузить програму:
      <button @click="loadProgram = true">
        Загрузить!!!
      </button>
    </div>
    <el-dialog title="Loading" :visible.sync="loadProgram" width="30%">
      <span>Загрузить файл как</span>
      <el-input v-model="programName" placeholder="Файл Программы" />
      <el-button @click="loadProgram = false">
        Отменить
      </el-button>
      <el-button type="primary" @click="loadProgramFile">
        Загрузить
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LoadingProgram",
  props: ["programLang"],

  data() {
    return {
      loadProgram: false,
      programName: "",
    }
  },

  mounted() {
    this.reloadProgramName()
  },

  methods: {
    loadProgramFile() {
      let text, fileName
      text = this.program
      fileName = this.programName
      this.$loadTextFile({
        text,
        fileName,
      })
      this.loadProgram = false
      this.reloadProgramName()
    },
    reloadProgramName() {
      if (this.programLang === 1) this.programName = "1.pas"
      else if (this.programLang === 2) this.programName = "1.py"
      else this.programName = "1.txt"
    },
  },
}
</script>

<style scoped></style>
