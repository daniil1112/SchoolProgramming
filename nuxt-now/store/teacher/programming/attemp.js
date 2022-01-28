export const actions = {
    async addInput({ commit }, options) {
        const {attemp, error, errorMessage} = (await this.$axios.post(
            "api/teacher/programming/addInputAttemp",
            {
                taskId: options.taskId,
                program: options.program,
                programLang: options.programLang,
                input: options.input,
            }
        )).data;

        if (attemp) commit('addInputAttemp',{taskId: options.taskId,attemp})

        return { error, errorMessage };
    },
    async addResolve({ commit }, options) {
        const {attemp, error, errorMessage} = (await this.$axios.post(
            "api/teacher/programming/addResolveAttemp",
            {
                taskId: options.taskId,
                program: options.program,
                programLang: options.programLang,
                input: options.input,
            }
        )).data;

        if (attemp) commit('addResolveAttemp',{taskId: options.taskId,attemp})

        return { error, errorMessage };
    },
    async loadInputAttemps({ commit }, options){
        if (getters['attempsInput'](options.taskId).length > 0)  return { error: null, errorMessage: null };
        const {attemps, error, errorMessage} = (await this.$axios.post(
            "api/teacher/programming/loadAttempsInput",
            {
                taskId: options.taskId,
            }
        )).data;
        if (attemps) commit('addInputAttemps',{attemps, taskId:options.taskId});
        return { error, errorMessage };
    },

    async loadResolveAttemps({ commit, getters }, options){
        if (getters['attempsResolve'](options.taskId).length > 0)  return { error: null, errorMessage: null };
        const {attemps, error, errorMessage} = (await this.$axios.post(
            "api/teacher/programming/loadResolveAttemps",
            {
                taskId: options.taskId,
            }
        )).data;
        if (attemps) commit('addResolveAttemps',{attemps, taskId:options.taskId});
        return { error, errorMessage };
    },
    async reloadInputAttemps({ commit, getters}, options){
        //Выборка не выполненых попыток
        const attempsIds = getters['attempsInput'](options.taskId).filter( e => e.status !== 'compiled').map(e => e._id);

        const {attemps} = (await this.$axios.post(
            "api/teacher/programming/reloadAttemps", {
                ids: attempsIds
            }
        )).data;

        let solved = false;
        attemps.forEach( e => {
            if (e.status === "compiled" && e.verdict && e.verdict.compilation && e.verdict.points && e.verdict.maxPoints && e.verdict.points === e.verdict.maxPoints) solved = true
            commit('refreshInputAttemp',{
                attemp: e,
                taskId: options.taskId
            })
        });
        return { solved }
    },
    async reloadResolveAttemps({ commit, getters}, options){
        //Выборка не выполненых попыток
        const attempsIds = getters['attempsResolve'](options.taskId).filter( e => e.status !== 'compiled').map(e => e._id);

        const {attemps} = (await this.$axios.post(
            "api/teacher/programming/reloadAttemps", {
                ids: attempsIds
            }
        )).data;

        let solved = false;
        attemps.forEach( e => {
            if (e.status === "compiled" && e.verdict && e.verdict.compilation && e.verdict.points && e.verdict.maxPoints && e.verdict.points === e.verdict.maxPoints) solved = true
            commit('refreshResolveAttemp',{
                attemp: e,
                taskId: options.taskId
            })
        });
        return { solved }
    }
};

export const mutations = {
    addInputAttemp(state, data){
        state.attemps.push({
            taskId: data.taskId,
            type: 'input',
            attemp: data.attemp
        })
    },
    addResolveAttemp(state, data){
        state.attemps.push({
            taskId: data.taskId,
            type: 'resolve',
            attemp: data.attemp
        })
    },

    addInputAttemps(state, data){
        state.attemps = state.attemps.filter ( e => e.taskId != data.taskId || e.type !== 'input');
        data.attemps.forEach( e => state.attemps.push({
            taskId: data.taskId,
            type: 'input',
            attemp: e
        }))
    },
    addResolveAttemps(state, data){
        state.attemps = state.attemps.filter ( e => e.taskId != data.taskId || e.type !== 'resolve');
        data.attemps.forEach( e => state.attemps.push({
            taskId: data.taskId,
            type: 'resolve',
            attemp: e
        }))
    },
    refreshInputAttemp(state,data){
        state.attemps = state.attemps.filter ( e => e.attemp._id != data.attemp._id );
        state.attemps.push({
            taskId: data.taskId,
            type: 'input',
            attemp: data.attemp
        })
    },
    refreshResolveAttemp(state,data){
        state.attemps = state.attemps.filter ( e => e.attemp._id != data.attemp._id );
        state.attemps.push({
            taskId: data.taskId,
            type: 'resolve',
            attemp: data.attemp
        })
    },


};

export const state = () => ({
    attemps: [],
})
export const getters = {
    attempsInput: (s) => (taskId) => {
        let attemps = s.attemps.filter( e => e.taskId == taskId && e.type === 'input');
        let result = []
        attemps.forEach( e => result.push(e.attemp));
        return result
    },
    attempsResolve: (s) => (taskId) => {
        let attemps = s.attemps.filter( e => e.taskId == taskId && e.type === 'resolve');
        let result = []
        attemps.forEach( e => result.push(e.attemp));
        return result
    },
    solvedAttemp: (s) => s.solvedAttemp,
}
