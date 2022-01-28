<template>
  <div>
    <section class="container">
      <el-input v-model="title" placeholder="Название" />
      <div
        ref="quill"
        v-model="content"
        v-quill:myQuillEditor="editorOption"
        class="quill-editor"
      />
      <el-button v-if="content && title" @click="saveMaterial">
        Сохранить материалы
      </el-button>
    </section>
  </div>
</template>

<script>
export default {
  layout: "teacher",
  middleware: "authTeacher",
  data() {
    return {
      content: "<p>Текст</p>",
      title: "",
      editorOption: {
        // some quill options
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ align: [] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block", "link", "image", "video"],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          ],
        },
      },
    }
  },
  mounted() {},
  methods: {
    async saveMaterial() {
      const result = await this.$axios.post(
        "https://server-now.moiplansh028.now.sh/api/teacher/materials/addMaterial",
        {
          text: this.content,
          title: this.title,
        }
      )

      console.log(result)
    },
  },
}
</script>
