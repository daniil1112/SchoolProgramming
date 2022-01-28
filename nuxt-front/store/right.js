export const actions = {
  async CreateTask({commit})
  {
    const res = await this.$axios.post('http://localhost:4000/rights/createTask');
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.access) await commit('createTaskAllow')

  },
  async UpdateGroup({commit},id)
  {
    const res = await this.$axios.post('http://localhost:4000/rights/UpdateGroup',{
      groupId: id
    });
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.access) await commit('updateGroupAllow')
  },
  async AllGroups({commit})
  {
    const res = await this.$axios.post('http://localhost:4000/rights/AllGroups');
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);

  }
};
export const mutations = {
  createTaskAllow(state){
    state.rights.createTask=true;
  },
  updateGroupAllow(state){
    state.rights.updateGroup=true;
  }
};

export const state = () => ({
  rights: {
    createTask: false,
    updateGroup: false
  },
});
export const getters = {
  rights: s=>s.rights,
};
