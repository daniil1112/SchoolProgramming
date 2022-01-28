import eventsBus from '@/plugins/eventBus'
export const actions = {
  async addGroup({commit}, group)
  {
      const res = await this.$axios.post('http://localhost:4000/api/teacher/addGroup',{
        name:group.name
      });
      if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
      if (res.data.success) eventsBus.$emit('success',res.data.successMessage);
      console.log(res.data);
  },
  async loadGroups({commit})
  {
    const res = await this.$axios.post('http://localhost:4000/api/teacher/allGroups',{});
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.groups) await commit('addGroups',res.data.groups)
  }
};
export const mutations = {
  addGroups(state, group) {
    state.groups = group
  }
};

export const state = () => ({
  groups: [],
});
export const getters = {
  groups: s=>s.groups
};
