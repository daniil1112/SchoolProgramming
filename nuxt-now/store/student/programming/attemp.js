export const actions = {
  async loadAttemps({ commit, getters }, options) {
    const oldAttemps = getters.attemps(options.groupTask)
    const groupTask = options.groupTask
    let attemps

    if (
      !oldAttemps ||
      oldAttemps.length === 0 ||
      oldAttemps.some(
        (element) =>
          element.status === "waiting" || element.status === "compiling"
      )
    ) {
      const result = await this.$axios.post(
        "/api/student/programming/loadAttemps",
        {
          groupTask,
        }
      )
      attemps = result.data.attemps
      if (attemps) {
        if (attemps.length === 0) {
          commit("addAttemps", { attemps, groupTask, maxStudentPoints: -1 })
        } else {
          let sorted = JSON.parse(JSON.stringify(attemps))
          sorted = sorted.filter((e) => {
            return e.status === "compiled" && e.verdict && e.verdict.compilation
          })
          sorted.sort((prev, curr) => {
            return curr.verdict.points - prev.verdict.points
          })
          let maxStudentPoints
          if (sorted.length === 0) {
            maxStudentPoints = -1
          } else {
            maxStudentPoints = sorted[0].verdict.points
          }
          commit("addAttemps", { attemps, groupTask, maxStudentPoints })
        }
      }
    }
  },

  async addAttemp({ commit }, options) {
    let result

    result = await this.$axios.post("/api/student/programming/addAttemp", {
      taskId: options.taskId,
      program: options.program,
      programLang: options.programLang,
      groupTask: options.groupTask,
    })

    if (result.data.resultProgram) {
      commit("addAttemp", {
        attemp: result.data.resultProgram,
        groupTask: options.groupTask,
      })
      console.log("Добавлена попытка")
      return true
    }
    console.log("Ошибка при добавлении")
    return false
  },
  async addTemplateAttemp({ commit }, options) {
    const {programmingText} = options
    let result

    result = await this.$axios.post("/api/student/programming/addTemplateAttemp", {
      programmingTextTemplate: programmingText,
      groupTaskId: options.groupTask,
    })

    console.log(result)

    if (result.data.resultProgram) {
      commit("addAttemp", {
        attemp: result.data.resultProgram,
        groupTask: options.groupTask,
      })
      console.log("Добавлена попытка")
      return true
    }
    console.log("Ошибка при добавлении")
    return false

    // if (result.data.resultProgram) {
    //   commit("addAttemp", {
    //     attemp: result.data.resultProgram,
    //     groupTask: options.groupTask,
    //   })
    //   console.log("Добавлена попытка")
    //   return true
    // }
    // console.log("Ошибка при добавлении")
    // return false
  },

}
export const mutations = {
  addAttemps(state, data) {
    state.attemps = state.attemps.filter((e) => e.groupTask !== data.groupTask)
    state.attemps.push({
      attemps: data.attemps,
      groupTask: data.groupTask,
      maxStudentPoints: data.maxStudentPoints,
    })
  },
  addAttemp(state, data) {
    let taskAttemps = state.attemps.find((e) => e.groupTask === data.groupTask)

    if (!taskAttemps) {
      let templ = []
      templ[0] = data.attemp
      state.attemps.push({
        attemps: templ,
        groupTask: data.groupTask,
      })
    } else {
      taskAttemps.attemps.push(data.attemp)
    }
  },
  clear(state) {
    state.attemps = []
    state.taskID = null
    state.solvedAttemp = null
  },
}

export const state = () => ({
  attemps: [],
  taskID: null,
  solvedAttemp: null,
})
export const getters = {
  attemps: (s) => (groupTask) => {
    const res = s.attemps.find((e) => e.groupTask === groupTask)
    if (res) return res.attemps
    return []
  },
  maxStudentPointsAttemps: (s) => (groupTask) => {
    const res = s.attemps.find((e) => e.groupTask === groupTask)
    if (res) return res.maxStudentPoints
    return 0
  },
  solvedAttemp: (s) => s.solvedAttemp,
}
