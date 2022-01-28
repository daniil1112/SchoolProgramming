export const actions = {
  async loadTasks({commit})
  {
      const res = await this.$axios.post('http://localhost:4000/api/tasks/all');
      if (res.data.tasks) await commit('addTasks',res.data.tasks)
  },
  async addTask({commit}, task)
  {
    const res = await this.$axios.post('http://localhost:4000/api/tasks/new',{
      shortTitle: task.shortTitle,
      title: task.title,
      body: task.body
    });

    console.log(res);


  }
};
export const mutations = {
  addTasks(state,tasks){
    state.tasks=tasks;
  }
};

export const state = () => ({
tasks: [],
});
export const getters = {
  tasks: s=>s.tasks,
};
