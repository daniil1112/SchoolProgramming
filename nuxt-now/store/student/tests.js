export const actions = {
  async loadTests({ commit, state }, options) {
    let result
    if (!state.tests.some((tests) => tests.task === parseInt(options.taskId))) {
      result = await this.$axios.post("/api/student/tests/loadTests", {
        taskId: options.taskId,
      })

      if (result.data.tests) {
        commit("addTests", {
          taskId: options.taskId,
          tests: result.data.tests,
        })
      } else if (result.data.tests === null) {
        commit("addTests", {
          taskId: options.taskId,
          tests: [],
        })
      }
    }
  },
}
export const mutations = {
  addTests(state, data) {
    let tests = {}
    tests.task = data.taskId
    tests.tests = data.tests
    state.tests = state.tests.filter((e) => e.task !== parseInt(data.taskId))
    state.tests.push(tests)
  },
}

export const state = () => ({
  tests: [],
})

export const getters = {
  tests: (s) => (taskId) =>
    s.tests.find((element) => element.task === parseInt(taskId)),
}
