import eventsBus from '@/plugins/eventBus'
export const actions = {
  async loadTests({commit},id)
  {
    const res = await this.$axios.post('http://localhost:4000/getTest',{_id:id});
    if (res.data.tests) await commit('addTests',res.data.tests);
  },
  async checkTest({commit}, data){
    const res = await this.$axios.post('http://localhost:4000/checkTest',{
      _id:data.id,
      answer: data.answer
    });
    if (res.data.successAnswer) eventsBus.$emit('success','Правильный ответ на тест');
    else eventsBus.$emit('error','Неправильный ответ на вопрос');
    console.log(res);
  },
  async allTestes({commit}) {
    const res = await this.$axios.post('http://localhost:4000/teacherTestes');
    if (res.data.testes) await commit('updateAllTestes',res.data.testes);
  }
};
export const mutations = {
  addTests(store,test){
    store.tests.push(test);
  },
  updateAllTestes(store,tests){
    store.tests = tests;
  }
};

export const state = () => ({
  tests: [],
  isRight: null
});
export const getters = {
  tests: s=>s.tests,
};
