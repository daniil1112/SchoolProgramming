export const actions = {
  async loadVerdict({ commit }, options) {
    let result
    result = await this.$axios.post("/api/student/reports/loadReport", {
      taskId: options.taskId,
      groupTask: options.groupTask,
    })
    console.log(options)
    if (result.data.verdict) {
      commit("addVerdict", result.data.verdict)
      commit("saveTaskId", options.taskId)
    } else {
      commit("clearVerdict")
    }
  },
}
export const mutations = {
  addVerdict(state, verdict) {
    state.verdict = verdict
  },
  saveTaskId(state, taskId) {
    state.taskId = taskId
  },
  clearVerdict(state) {
    state.verdict = null
  },
}

export const state = () => ({
  verdict: null,
  taskId: null,
})
export const getters = {
  verdict: (s) => s.verdict,
}
