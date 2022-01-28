import eventsBus from "@/plugins/eventBus"
export const actions = {
  async loadProgramingTasks({ commit }) {
    const res = await this.$axios.post("/api/student/loadLessons")

    if (res.data.tasks) await commit("addProgrammingTask", res.data.tasks)
  },
}
export const mutations = {
  addProgrammingTask(state, tasks) {
    state.ProgrammingTasks = tasks
  },
}

export const state = () => ({
  ProgrammingTasks: [],
})
export const getters = {
  programmingTasks: (s) => s.ProgrammingTasks,
}
