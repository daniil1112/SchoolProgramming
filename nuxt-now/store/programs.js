export const actions = {
  async loadProgramTask({ commit }, id) {
    await commit("clearProgramTask")
    const res = await this.$axios.post("/api/student/programming/loadTask", {
      taskId: id,
    })
    await commit("addProgramTask", res.data.task)
  },
}
export const mutations = {
  addProgramTask(state, program) {
    state.programTask.task = program.task
    state.programTask.title = program.title
    if (program.samples) state.programTask.samples = program.samples
  },
  clearProgramTask(state) {
    state.programTask = {
      task: null,
      title: null,
    }
  },
}

export const state = () => ({
  programTask: {
    task: null,
    title: null,
  },
})
export const getters = {
  programTask: (s) => s.programTask,
}
