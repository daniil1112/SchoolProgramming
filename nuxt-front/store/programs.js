export const actions = {
  async loadProgramTask({commit},id) {
      const res = await this.$axios.post('http://localhost:4041/gettask',{_id:id});
      await commit('addProgramTask',res.data.program)
  }

};
export const mutations = {
  addProgramTask(state,program) {
    state.programTask.task = program.task;
    state.programTask.title = program.title
  }


};

export const state = () => ({
  programTask:{
    task:null,
    title:null
  }
});
export const getters = {
  programTask: s=>s.programTask,
};
