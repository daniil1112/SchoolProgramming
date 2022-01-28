<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Задание</span>
      </div>
      <div>
        <p>
          <span>Тип задания: <span v-html="groupTask" /></span>
          <update-tests v-if="groupTask"
            :task="groupTask"
          />
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
import UpdateTests from "../../../../../../components/teacher/groups/groupTasks/updateTests";
export default {
  components: {UpdateTests},
  layout: "teacher",
  middleware: "authTeacher",
  name: "Update",
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.task)
  },

  data() {
    return {
      groupTask: null,
    }
  },
  async mounted() {
    this.loadTask()
  },

  methods: {
    async loadTask() {
      const result = await this.$axios.post(
        "/api/teacher/groups/loadGroupTask",
        {
          task: this.$route.params.task,
        }
      )
      if (result.data.groupTask) {
        this.groupTask = result.data.groupTask
      }
      console.log(result)
    },
  },
}
</script>

<style scoped></style>
