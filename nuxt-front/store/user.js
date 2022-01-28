import eventsBus from '@/plugins/eventBus'
export const actions = {
  async loginQuery({commit}, user) {
    const res = await this.$axios.post('http://localhost:4000/api/auth/login', {
      login: user.login,
      password: user.password
    });
    if (res.data.user) {
      await commit('addLoginedUser',res.data.user);
      eventsBus.$emit('LoginInHeaderUserName',res.data.user.name);
    }
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
  },
  async registerQuery({commit}, user)
  {
    const data = {
      name: user.name,
      login: user.login,
      password: user.password,
      group: user.group
    };
    const res = await this.$axios.post('http://localhost:4000/api/teacher/newStudent', data);
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.success) eventsBus.$emit('success',res.data.successMessage);

  },
  async logout({commit})
  {
    localStorage.removeItem('authToken');
    await commit('logout');
  },
  async checkLogin({commit}) {
    const res = await this.$axios.post('http://localhost:4000/api/auth/getUser');
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.user) await commit('addLoginedUser',res.data.user);
  },
  async loadGroupUsers({commit},id)
  {
    const res = await this.$axios.post('http://localhost:4000/api/teacher/loadGroupUsers',{
      groupId: id
    });
    if (res.data.errors) eventsBus.$emit('error',res.data.errorMessage);
    if (res.data.users) await commit('addGroupUsers',res.data.users);
  }

};
export const mutations = {
  addLoginedUser(state,user)
  {
    state.user.name = user.name;
    state.user.email = user.email;
    state.user.state = user.state;
  },
  logout(state)
  {
    state.user = {
      name: null,
      email: null,
      state: null
    }
  },
  addGroupUsers(state,users){
    state.users = users
  }
};

export const state = () => ({
  user:{
    name: null,
    email: null,
    state: null
  },
  users:[]
});
export const getters = {
  user: s => s.user,
  users: s => s.users
};
