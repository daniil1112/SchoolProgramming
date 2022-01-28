export const actions = {
    async loadCounter( { commit, getters }, data) {
        const {group, force} = data
        if (typeof getters['counter'](group) === 'undefined' || force){
            try{
                const {counter} = (await this.$axios.post('/api/teacher/grouptasks/counter', {
                    group
                })).data
                commit('setCounter', {counter, group})
            }catch (e) {
                return console.error(e)
            }
        }
    },

    async loadAllTasks( { commit, getters }, data){
        const {group, force} = data
        if (typeof getters['tasks']({group}) === 'undefined' || force || getters['tasks']({group}).length !== getters['counter'](group)){
            try {
                const {tasks} = (await this.$axios.post('/api/teacher/grouptasks/all', {
                    group
                })).data
                commit('setTasks', {tasks, group})
            }catch (e) {
                return console.log(e)
            }
        }
    },

    async loadSomeTasks( { commit, getters }, data){
        const {group, force, pp} = data
        if (typeof getters['tasks']({group}) === 'undefined' || force || getters['tasks']({group}).length === 0){
            try {
                const {tasks} = (await this.$axios.post('/api/teacher/grouptasks/someTasks', {
                    group,
                    pp
                })).data
                commit('setTasks', {tasks, group})
            }catch (e) {
                return console.log(e)
            }
        }
    }

}
export const mutations = {
    setTasks(state, data) {
        state.tasks[data.group] = data.tasks
        const res = state.tasks
        state.tasks = []
        state.tasks = [...res]
    },
    setCounter(state, data) {
        state.counter[data.group] = data.counter
        const res = state.counter
        state.counter = []
        state.counter = [...res]
    }
}

export const state = () => ({
    counter: [],
    tasks: []
})

export const getters = {
    counter: (s) => (group) => s.counter[group],
    tasks: (s) => (options) =>  {
        let {group, page, pp} = options
        if (pp) {
            let start = (page - 1) * pp;
            let end = start + pp;
            if (!s.tasks[group]) return []
            let notes = s.tasks[group].slice(start, end);
            return notes
        }
        return s.tasks[group]
    }
}

