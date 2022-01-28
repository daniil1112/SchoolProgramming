export const actions = {
  async loadVerdict({ commit }, options) {
    let result
    if (options.type === "student") {
      result = await this.$axios.post(
        "/api/student/programming/loadTaskVerdict",
        {
          taskId: options.taskId,
          groupTask: options.groupTask,
        }
      )
    }
    if (result.data.verdict) {
      commit("addVerdict", result.data.verdict)
    } else {
      commit("clearVerdict")
    }
  },
}
export const mutations = {
  addVerdict(state, verdict) {
    state.verdict = verdict
  },
  clearVerdict(state) {
    state.verdict = null
  },
}

export const state = () => ({
  verdict: null,
})
export const getters = {
  verdict: (s) => s.verdict,
}
