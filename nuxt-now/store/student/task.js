export const actions = {
  async loadTask({ commit, state }, options) {
    let task
    //Lazy load
    if (!state.taskId || options.taskId !== state.taskId) {
      task = await this.$axios.post("api/student/lesson/loadTask", {
        taskId: options.taskId,
      })
      if (task.data.task) {
        commit("setTask", task.data.task)
      } else {
        commit("clearTask")
      }
      commit("updateTaskId", options.taskId)
    }
  },

  async loadAllTasks({ commit, state }) {
    let tasks

    //Lazy load
    if (!state.tasks || state.tasks.length === 0) {
      tasks = await this.$axios.post(
        "/api/student/lesson/loadTasks"
      )
      if (tasks.data.tasks) {
        commit("setTasks", tasks.data.tasks)
      }
    }
  },

  async loadTestTasks({ commit }) {
    const type = 1
    const tasks = await this.$axios.post(
      "/api/student/tasks/loadTasks",
      { type }
    )
    if (tasks.data.tasks) {
      commit("setTasks", tasks.data.tasks)
    }
  },
  async loadProgrammingTasks({ commit }) {
    const type = 2
    const tasks = await this.$axios.post(
      "/api/student/tasks/loadTasks",
      { type }
    )
    if (tasks.data.tasks) {
      commit("setTasks", tasks.data.tasks)
    }
  },
}
export const mutations = {
  setTask(state, task) {
    state.task = task
  },
  setTasks(state, tasks) {
    state.tasks = tasks
  },
  clearTask(state) {
    state.task = null
  },
  clearTasks(state) {
    state.task = null
  },
  updateTaskId(state, taskId) {
    state.taskId = taskId
  },
}

export const state = () => ({
  task: null,
  tasks: [],
  taskId: null,
})
export const getters = {
  task: (s) => (taskId) => s.tasks.find((e) => e._id === parseInt(taskId)),
  tasks: (s) => (type) => s.tasks.filter((e) => e.type === type),
}
