export const actions = {
  async loginQuery({ commit }, user) {
    const res = await this.$axios.post("/api/auth/login", {
      login: user.login,
      password: user.password,
    })
    if (res.data.user) {
      await commit("addLoginedUser", res.data.user)
    }
    if (res.data.error) {
      let title, message
      title = "Ошибка при входе"
      if (res.data.code === 1) {
        message = "Ошибка входных параметров"
      } else if (res.data.code === 2) {
        message = "Неверный логин или пароль"
      } else if (res.data.code === 3) {
        message = "Неизвестная ошибка"
      }
      eventsBus.$emit("error", {
        title,
        message,
      })
    }
  },
  async registerQuery({ commit }, user) {
    const data = {
      name: user.name,
      login: user.login,
      password: user.password,
      group: user.group,
    }
    let res = await this.$axios.post("/api/teacher/newStudent", data)
    return res
  },
  async loadGroupUsers({ commit }, id) {
    const res = await this.$axios.post("/api/teacher/loadGroupUsers", {
      groupId: id,
    })
    if (res.data.errors) eventsBus.$emit("error", res.data.errorMessage)
    if (res.data.users) await commit("addGroupUsers", res.data.users)
  },
}
export const mutations = {
  addLoginedUser(state, user) {
    state.user.name = user.name
    state.user.email = user.email
    state.user.state = user.state
  },
  addGroupUsers(state, users) {
    state.users = users
  },
}

export const state = () => ({
  user: {
    name: null,
    email: null,
    state: null,
  },
  users: [],
})
export const getters = {
  user: (s) => s.user,
  users: (s) => s.users,
}
