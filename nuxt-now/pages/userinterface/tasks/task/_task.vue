<template>
  <div>
    <UserTest
      v-if="
        task &&
        task._id &&
        task.type === 1 &&
        task._id === parseInt(this.$route.params.task)
      "
      :id="task._id"
      :options="task"
    />
    <new-programming-task
      v-if="task && task.type === 2"
      :id="task._id"
      :groupTask="task"
    />
    <LessonMaterial v-if="task && task.type === 3" :id="task.task" />
  </div>
</template>

<script>
import { mapState } from "vuex"
import UserTest from "@/components/UserTest"

import LessonMaterial from "@/components/LessonMaterial"
import NewProgrammingTask from "@/components/newProgrammingTask"
export default {
  middleware: "authStudent",
  name: "TaskId",
  layout: "student",
  validate({ params }) {
    return /^\d+$/.test(params.task)
  },
  components: { NewProgrammingTask, LessonMaterial, UserTest },
  data() {
    return {
      options: null,
    }
  },

  computed: {
    task() {
      return this.$store.getters["student/task/task"](this.$route.params.task)
    },
  },
  async mounted() {
    await this.$store.dispatch("student/task/loadAllTasks")
  },
}
</script>

<style scoped></style>
