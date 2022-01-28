export const actions = {
  async loadTask({ commit }, options) {
    let result
    commit("clearTask")
    commit("clearSolvedAttemp")
    commit("clearSolved")
    if (options.type === "teacher") {
      result = await this.$axios.post("/api/teacher/programming/loadTask", {
        taskId: options.taskId,
      })
    } else if (options.type === "student") {
      result = await this.$axios.post("/api/student/programming/loadTask", {
        taskId: options.taskId,
      })
    }
    console.log(options, result)
    if (result.data.task) {
      commit("saveTask", result.data.task)
      if (options.type === "teacher") {
        commit("saveStatusSolve", result.data.task)
      }
    }
  },
  async loadInputTask({ commit }, options) {
    let result
    commit("clearTask")
    commit("clearSolvedAttemp")
    commit("clearSolved")
    if (options.type === "teacher") {
      result = await this.$axios.post("/api/teacher/programming/loadTask", {
        taskId: options.taskId,
      })
    } else if (options.type === "student") {
      result = await this.$axios.post("/api/student/programming/loadTask", {
        taskId: options.taskId,
      })
    }
    if (result.data.task) {
      commit("saveTask", result.data.task)
      if (options.type === "teacher") {
        commit("saveStatusSolve", result.data.task)
      }
    }
  },
}
export const mutations = {
  saveTask(state, task) {
    state.task = task
  },
  saveStatusSolve(state, task) {
    if (task.solved) {
      state.solved = true
      state.solvedAttemp = task.solvedAttemp
    }
  },
  clearTask(state) {
    state.task = Object
  },
  clearSolvedAttemp(state) {
    state.solvedAttemp = Number
  },
  clearSolved(state) {
    state.solved = false
  },
}

export const state = () => ({
  task: Object,
  solved: false,
  solvedAttemp: Number,
})
export const getters = {
  task: (s) => s.task,
  solved: (s) => s.solved,
  solvedAttemp: (s) => s.solvedAttemp,
}
