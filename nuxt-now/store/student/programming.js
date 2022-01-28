export const actions = {
  async loadAttemps({ commit, state, rootState }, options) {
    if (
      state.attemps &&
      !state.attemps.some(
        (element) =>
          element.status === "waiting" || element.status === "compiling"
      ) &&
      state.taskID === options.taskId
    ) {
      console.log("no changes attemps")
      return {
        compiling: false,
        success: true,
      }
    } else {
      let maxPoints = 0
      if (state.taskID !== options.taskId) {
        commit("clear")
      }

      console.log("update attemps")
      let result
      result = await this.$axios.post("/api/student/programming/loadAttemps", {
        taskId: options.taskId,
        groupTask: options.groupTask,
      })

      if (result.data.attemps) {
        commit("saveAttemps", result.data.attemps)
        commit("saveTaskId", options.taskId)
        state.attemps.forEach((e) => {
          if (e.status === "compiled") {
            if (e.verdict.points) {
              if (e.verdict.points >= maxPoints) {
                maxPoints = e.verdict.points
              }
            }
          }
        })

        if (
          !rootState.student.verdict.verdict ||
          maxPoints !== rootState.student.verdict.verdict ||
          !rootState.student.verdict.taskId ||
          rootState.student.verdict.taskId !== state.taskId
        ) {
          await this.dispatch("student/verdict/loadVerdict", {
            taskId: options.taskId,
            groupTask: options.groupTask,
          })
        }
      }
    }
    console.log(rootState.student.verdict)
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
      commit("addAttemp", result.data.resultProgram)
      console.log("Добавлена попытка")
      return true
    }
    console.log("Ошибка при добавлении")
    return false
  },
}
export const mutations = {
  saveTaskId(state, taskID) {
    state.taskID = taskID
  },
  saveAttemps(state, attemps) {
    state.attemps = attemps
  },
  addAttemp(state, attemp) {
    state.attemps.push(attemp)
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
  attemps: (s) => s.attemps,
  solvedAttemp: (s) => s.solvedAttemp,
}
