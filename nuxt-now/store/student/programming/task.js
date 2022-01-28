export const actions = {
  async loadTask({ commit, state }, options) {
    let result
    if (!state.tasks.some((e) => e.taskId === options.taskId)) {
      result = await this.$axios.post("/api/student/programming/loadTask", {
        taskId: options.taskId,
      })
      if (result.data.task) {
        commit("addTask", {
          task: result.data.task,
          taskId: options.taskId,
        })
      }
    }
  },
}
export const mutations = {
  addTask(state, data) {
    state.tasks = state.tasks.filter((e) => e.taskId !== data.taskId)
    data.task.taskId = data.taskId
    state.tasks.push(data.task)
  },
}

export const state = () => ({
  tasks: [],
})
export const getters = {
  task: (s) => (taskId) => s.tasks.find((e) => e.taskId === taskId),
}
