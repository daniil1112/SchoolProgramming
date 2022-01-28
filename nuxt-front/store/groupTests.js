import eventsBus from '@/plugins/eventBus'
export const actions = {
  async addTestsGroup({commit}, data) {
    const res = await this.$axios.post('http://localhost:4000/addTestsGroup', {
      title:data.title,
      testes: data.testes
    });

    if (res.data.errors) eventsBus.$emit('error', 'Ошибка при форматировании группы тестов');
    if (res.data.success) eventsBus.$emit('success', 'Группа тестов сформарованнна');
  },

  async loadTests({commit}, id) {
    const res = await this.$axios.post('http://localhost:4000/loadTestsInGroup', {
      id: id
    });
    await commit('addTests', res.data.tests)
  },
  async allBlocks({commit}) {
    const res = await this.$axios.post('http://localhost:4000/allTeacherTestBLocks');
    if (res.data.blocks) await commit('loadBlocks',res.data.blocks);
  },
  async loadReport({commit},id)
  {
    const res = await this.$axios.post('http://localhost:4000/FindReportTestsBlock',{
      id: id
    });
    if (res.data.report) await commit('addReport',res.data.report);
    else await commit('cleanReport')
  },
  async cleanTestes({commit}){
    await commit('cleanTestes');
  }
}
export const mutations = {
  addTests(state,tests){
    state.groupTestes=tests
  },
  loadBlocks(state,blocks)
  {
    state.blocks = blocks
  },
  addReport(state,report)
  {
    state.report = report
  },
  cleanTestes(state)
  {
    state.groupTestes = []
  },
  cleanReport(state)
  {
    state.report=null
  }
};

export const state = () => ({
  groupTestes: null,
  report:null,
  blocks: null
});
export const getters = {
  tests: s=>s.groupTestes,
  blocks: s=>s.blocks,
  report: s=>s.report
};
