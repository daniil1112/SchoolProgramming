export const actions = {
  async loadGroups({ commit, state }) {
    if (state.groups.length === 0) {
      const res = await this.$axios.post("/api/teacher/groups/all")
      if (res.data.groups) await commit("addGroups", res.data.groups)
    }
  },

  async reloadGroupUsers({ commit, state }) {
    if (state.groupId) {
      const res = await this.$axios.post("/api/teacher/groups/loadGroupUsers", {
        groupId: state.groupId,
      })
      if (res.data.users) {
        commit("addGroupUsers", res.data.users)
      }
    }
  },

  async deleteStudent({ commit }, userId) {
    return await this.$axios.post("/api/teacher/groups/deleteStudent", {
      userId: userId,
    })
  },

  async updateStudent({ commit }, data) {
    return await this.$axios.post(
        "/api/teacher/groups/updateStudent",
        data
    )
  },

  async changeStudentGroup({ commit }, data) {
    return await this.$axios.post(
        "/api/teacher/groups/changeStudentGroup",
        data
    )
  },
}
export const mutations = {
  addGroups(state, groups) {
    state.groups = groups
  },
  addGroupUsers(state, users) {
    state.groupUsers = users
  },
  setGroupId(state, groupId) {
    state.groupId = groupId
  },
}

export const state = () => ({
  groupId: null,
  groups: [],
  groupUsers: [],
})
export const getters = {
  groups: (s) => s.groups,
}
