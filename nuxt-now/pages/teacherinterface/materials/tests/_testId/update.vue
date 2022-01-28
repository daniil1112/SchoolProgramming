<template>
  <div v-if="loading">
    Красивая загрузка......
  </div>
  <div v-else-if="code">
    <div v-if="code">
      Теста не существует
    </div>
  </div>
  <div v-else>
    <Update :test="test" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import Update from "./../../../../../components/teacher/test/update/Update"
export default {
  name: "Update",
  layout: "teacher",
  middleware: "authTeacher",
  components: { Update },
  validate({ params }) {
    return /^\d+$/.test(params.testId)
  },
  data() {
    return {
      code: false,
      loading: true,
    }
  },
  computed: {
    ...mapState({
      test: (state) => state.teacher.test.test,
    }),
  },
  async mounted() {
    const { code } = await this.$store.dispatch(
      "teacher/test/loadTest",
      this.$route.params.testId
    )
    if (code) this.code = code
    this.loading = false
  },
}
</script>

<style scoped></style>
