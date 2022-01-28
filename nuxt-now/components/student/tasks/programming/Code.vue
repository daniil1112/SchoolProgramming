<template>
  <div v-show="attempsLeft && attempsLeft > 0">
    <div>
      <span>Язык програмирования</span>
      <el-select v-model="programLang" placeholder="Programming language">
        <el-option
          v-for="item in programLangSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div>
      <client-only>
        <prism-editor
          ref="prismEditorRef"
          v-model="program"
          :language="prismLang"
          :line-numbers="true"
          placeholder="Программа"
          autosize
        />
      </client-only>
    </div>
    <el-button
      :loading="!attemps || attemps.some((e) => e.status !== 'compiled')"
      @click="addAttemp"
      v-if="attempsLeft && attempsLeft > 0"
    >
      Проверить
    </el-button>
  </div>
</template>

<script>
import "prismjs"
import "prismjs/themes/prism.css"
import { mapState } from "vuex"
import PrismEditor from "vue-prism-editor"
import "prismjs/themes/prism-okaidia.css"
import "prismjs/components/prism-pascal"
import "prismjs/components/prism-python"
import "vue-prism-editor/dist/VuePrismEditor.css"
import eventBus from "@/plugins/eventBus"
export default {
  name: "Code",
  components: {
    PrismEditor,
  },
  props: ["attemps",'attempsLeft'],

  data() {
    return {
      programLang: 1,
      program: "",
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
    }
  },

  computed: {
    prismLang() {
      if (this.programLang === 1) return "pascal"
      else if (this.programLang === 2) return "python"
      else return "pascal"
    },
  },

  mounted() {
    eventBus.$on("set-default-code-lang", (data) => {
      this.program = data.program
      this.programLang = data.programLang
    })
  },

  methods: {
    addAttemp() {
      const {programLang,attempsLeft} = this
      if (attempsLeft && attempsLeft > 0){
        this.$emit("add-attemp", {
          program: this.$refs.prismEditorRef.codeData,
          programLang,
        })
      } else {
        this.$notify.error({
          title: 'Ошибка',
          message: 'Все попытки потрачены'
        })
      }
    },
  },
}
</script>

<style scoped></style>
