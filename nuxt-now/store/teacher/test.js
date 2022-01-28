export const actions = {
  async createTest({ commit }, options) {
    const result = await this.$axios.post("/api/teacher/tests/addTest", {
      title: options.title,
      task: options.task,
      type: options.type,
      answerChoice: options.answerChoice,
      rightAnswer: options.rightAnswer,
    })
    const { code, id } = result.data

    if (code) {
      return { code }
    } else if (id) {
      return { _id: id }
    }
  },
  async updateTest({ commit }, options) {
    const result = await this.$axios.post("/api/teacher/tests/update", {
      _id: options._id,
      title: options.title,
      task: options.task,
      type: options.type,
      answerChoice: options.answerChoice,
      rightAnswer: options.rightAnswer,
    })
    const { code, test } = result.data

    if (code) {
      return { code }
    } else if (test) {
      commit("setTest", test)
      return { code: false }
    }
  },
  async loadTest({ commit, state }, id) {
    if (state.test && id !== state.test._id) {
      const { test, code } = (
        await this.$axios.post("/api/teacher/tests/load", { testId: id })
      ).data
      if (test) commit("setTest", test)
      return { code, test }
    }
    return { test: state.test }
  },
}
export const mutations = {
  setTest(state, test) {
    state.test = test
  },
}

export const state = () => ({
  test: null,
})
