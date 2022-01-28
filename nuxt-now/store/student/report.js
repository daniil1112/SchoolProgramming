export const actions = {
  async loadReport({ commit, state }, options) {
    let report

    if (
      !state.reports.some((report) => report.task === parseInt(options.taskId))
    ) {
      report = await this.$axios.post("api/student/reports/loadReport", {
        taskId: options.taskId,
      })

      if (report.data.report) {
        commit("addReport", report.data.report)
      } else {
        commit("addEmptyReport", options.taskId)
      }
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
    return report
  },

  async reloadReport({ commit, state }, options) {
    let report
    report = await this.$axios.post("api/student/reports/loadReport", {
      taskId: options.taskId,
    })

    if (report.data.report) {
      commit("addReport", report.data.report)
    } else if (
      !state.reports.some((report) => report.task === parseInt(options.taskId))
    ) {
      commit("addEmptyReport", options.taskId)
    }
  },

  async closeTestsTask({ commit }, options) {
    let report

    report = await this.$axios.post("api/student/reports/closeTestsTask", {
      taskId: options.taskId,
    })

    return report
  },
}
export const mutations = {
  addReport(state, report) {
    state.reports = state.reports.filter((e) => e.task !== report.task)
    state.reports.push(report)
  },
  addEmptyReport(state, taskId) {
    state.reports = state.reports.filter((e) => e.task !== taskId)
    state.reports.push({
      task: parseInt(taskId),
      answers: null,
      points: null,
      empty: true,
    })
  },
}

export const state = () => ({
  reports: [],
})
export const getters = {
  report: (s) => (taskId) =>
    s.reports.find((element) => element.task === parseInt(taskId)),
}
