export const actions = {
  async loadReport({ commit }, options) {
    let report
    report = await this.$axios.post("api/student/reports/loadReport", {
      taskId: options.taskId,
    })

    if (report.data.report) {
      commit("addReport", report.data.report)
    }
  },
  async createReport({ commit }, options) {
    let report
    report = await this.$axios.post("api/student/reports/createReport", {
      taskId: options.taskId,
      answers: options.answers,
    })
    if (report.data.report) {
      commit("addReport", report.data.report)
    }
    console.log(report)
    return report
  },
}
export const mutations = {
  addReport(state, report) {
    state.report = report
  },
}

export const state = () => ({
  report: null,
})
export const getters = {
  report: (s) => s.report,
}
