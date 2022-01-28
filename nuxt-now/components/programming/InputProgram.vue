<template>
  <div>
    <div>
      <span>Язык програмирования</span>
      <el-select v-model="ProgramLang" placeholder="Programming language">
        <el-option
          v-for="item in programLangSelect"
          :key="item.value"
          :disabled="compiling"
          :label="item.label"
          :value="item._id"
        />
      </el-select>
    </div>
    <client-only>
      <prism-editor
        ref="prismEditorRef"
        v-model="program"
        :language="prismLang"
        :line-numbers="true"
        placeholder="Программа"
        autosize
        :readonly="compiling"
      />
    </client-only>
    <b-button-group>
      <mdb-btn
              color="primary"
              :disabled="compiling"
              @click="exportProgram"
      >
        <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-show="compiling"></span>
        Создать программу
      </mdb-btn>
      <slot name="buttons"/>
    </b-button-group>
  </div>
</template>

<script>
import "prismjs"
import PrismEditor from "vue-prism-editor"
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-pascal"
import "prismjs/components/prism-python"
import "vue-prism-editor/dist/VuePrismEditor.css"
export default {
  name: "InputProgram",
  components: {
    PrismEditor,
  },
  props: ["compiling","langs","code",'lang'],
  data() {
    return {
      ProgramLang: 1,
      program: this.code
    }
  },


  mounted() {
    if (this.lang) this.ProgramLang = this.lang
  },
  computed: {
    prismLang() {
      if (this.ProgramLang === 1) return "pascal"
      else if (this.ProgramLang === 2) return "python"
      return "pascal"
    },
    programLangSelect(){
      if (!this.langs) {
        return [
          {
            _id: 1,
            label: "PascalABCNet",
          },
          {
            _id: 2,
            label: "Python 3",
          },
        ]
      }
      return this.langs
    }
  },

  methods: {
    exportProgram() {
      this.$emit("export-program", {
        program: this.$refs.prismEditorRef.codeData,
        programLang: this.ProgramLang,
      })
    },
  },
}
</script>

<style scoped></style>
