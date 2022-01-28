<template>
  <div>
    <div v-if="loading">
      Красивая загрузка......
    </div>
    <div v-else-if="code">
      <div v-if="code">
        Теста не существует
      </div>
    </div>
    <div v-else>
      <ViewTest :test="test" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"
import View from "@/components/teacher/test/view/View"
export default {
  name: "Index",
  components: { ViewTest: View },
  layout: "teacher",
  middleware: "authTeacher",
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
