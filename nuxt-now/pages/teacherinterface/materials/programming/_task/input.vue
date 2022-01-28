<template>
  <div>
    <!--        TODO нормальная загрузка-->
    <create-input-page v-if="stage === 1" @change-stage="secondStage" />
    <create-resolve v-if="stage === 2" @change-stage-down="firstStage" />
  </div>
</template>

<script>
import CreateInputPage from "@/components/programming/CreateInputPage"
import CreateResolve from "@/components/programming/CreateResolve"
export default {
  name: "Input",
  layout: "teacher",
  middleware: "authTeacher",
  components: {
    CreateResolve,
    CreateInputPage,
  },
  data() {
    return {
      currentStage: null,
      stage: 1,
    }
  },
  computed: {
    task() {
      return this.$store.getters["programming/task/task"]
    },
  },

  methods: {
    secondStage() {
      this.stage = 2
    },
    firstStage() {
      this.stage = 1
    },
  },
}
</script>

<style scoped></style>
