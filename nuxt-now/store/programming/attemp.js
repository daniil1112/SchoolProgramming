export const actions = {
  async addAttemp({ commit }, options) {
    let result
    if (options.type === "student") {
      result = await this.$axios.post("/api/student/programming/addAttemp", {
        taskId: options.taskId,
        program: options.program,
        programLang: options.programLang,
      })
    } else if (options.type === "teacher") {
      result = await this.$axios.post("/api/teacher/programming/confirmTask", {
        taskId: options.taskId,
        program: options.program,
        programLang: options.programLang,
      })
    }
    if (result.data.resultProgram) {
      commit("addAttemp", result.data.resultProgram)
    }
    return result
  },

  async loadAttemps({ commit }, options) {
    let result

    if (options.type === "teacher") {
      result = await this.$axios.post("/api/teacher/programming/loadAttemps", {
        taskId: options.taskId,
      })
    } else if (options.type === "student") {
      result = await this.$axios.post("/api/student/programming/loadAttemps", {
        taskId: options.taskId,
      })
    }

    if (result.data.attemps) {
      commit("saveAttemps", result.data.attemps)
    } else {
      commit("clearAttemps")
    }
  },

  loadSolvedAttemp({ commit }, attempID) {
    commit("solvedAttemp", attempID)
  },
}
export const mutations = {
  saveAttemps(state, attemps) {
    state.attemps = attemps
  },
  solvedAttemp(state, attempID) {
    state.solvedAttemp = state.attemps.filter(
      (attemp) => attemp._id === attempID
    )[0]
  },
  addAttemp(state, attemp) {
    state.attemps.push(attemp)
  },
  clearAttemps(state) {
    state.attemps = Array
  },
  clearSolvedAttemp(state) {
    state.solvedAttemp = Object
  },
}

export const state = () => ({
  attemps: [],
  solvedAttemp: Object,
})
export const getters = {
  attemps: (s) => s.attemps,
  solvedAttemp: (s) => s.solvedAttemp,
}
