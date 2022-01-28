const objLength = function (obj){
    return Object.keys(obj).length
}


export const actions = {
    async loadTask({ commit, state }, options) {
        let task;
        if (state.tasks.some( e => e.id == options.taskId) && !options.force) return ;
        const result = await this.$axios.post("/api/teacher/programming/loadTask", {taskId: options.taskId});
        if (result.data && result.data.task) task = result.data.task;
        if (task) commit("setTask", task);
    },
    async loadAllTasks({commit, state}) {
        if (objLength(state.tasksNew) !== state.counter) {
            const {tasks, error, errorMessage} = (await this.$axios.post("/api/teacher/programming/allTasks")).data;
            if (error) return {counter, error, errorMessage}
            commit('setTasks', tasks)
            return {tasks, error, errorMessage}
        }
    },
    async loadCounter({commit, state}) {
        if (!state.counter) {
            const {counter, error, errorMessage} = (await this.$axios.post("/api/teacher/programming/counterTasks")).data;
            if (error) return {counter, error, errorMessage}
            commit('setCounter', counter)
            return {counter, error, errorMessage}
        }
    },
    async addInput({ commit, state, dispatch }, options) {
        if (!state.tasks.some( e => e.id == options.taskId) ) {
            await dispatch('loadTask', {taskId: options.taskId});
            return { error: false }
        }
        try {
            const {input, error, errorMessage} = (await this.$axios.post("api/teacher/programming/addInput", {
                taskId: options.taskId,
                input: options.input,
            })).data;
            if (input) commit("setInput", {
                taskId: options.taskId,
                input
            });
            return { error, errorMessage };
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },
    async setTaskType( {commit}, options ) {
        const {type, taskId, template} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/setType", {type, taskId, template})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },
    async setLangs( {commit}, options ) {
        const {taskId, languages} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/languages/settask", {taskId, languages})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },
    async setTimelimit( {commit}, options){
        const {type, timeLimit, taskId} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/setTimelimit", {type, timeLimit, taskId})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },

    async updateTitleAndTask( {commit}, options){
        const {title, task, taskId} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/updateTitleAndTask", {title, task, taskId})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },
    async updateExamples( {commit}, options){
        const {taskId, examples} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/updateExamples", {taskId, examples})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },

    async setReady( {commit}, options){
        const {taskId} = options;
        try {
            const { error, errorMessage} = (await this.$axios.post("api/teacher/programming/setReady", {taskId})).data;
            return  { error, errorMessage }
        } catch (e) {
            console.error(e);
            return { error: true, errorMessage:'Неизвестная ошибка' };
        }
    },

};
export const mutations = {
    setTask(state,task){
        let data = {
            task, id: task._id
        };
        state.tasks = state.tasks.filter( e => e.id !== task._id);
        state.tasks.push(data)
    },
    setTasks(state, tasks) {
        state.tasksNew = {}
        tasks.forEach(e => {
            state.tasksNew[e._id] = e
        })
    },
    setInput(state, options){
        let task = state.tasks.find( e => e.id == options.taskId);
        state.tasks = state.tasks.filter( e => e.id !== options.taskId);
        task.task.input = options.input;
        state.tasks.push(task);
    },
    clearSolvedStatus(state, taskId){
        let task = state.tasks.find( e => e.id == taskId);
        if (task && task.task){
            task.task.solved = false;
            if (task.task.solvedAttemp) task.solvedAttemp = 0
        } else return console.error('Неизвестная ошибка');

        state.tasks = state.tasks.filter( e => e.id != taskId);
        state.tasks.push(task)

    },
    setCounter(state, counter){
        state.counter = counter
    }
};

export const state = () => ({
    tasks: [],
    tasksNew: {},
    counter: false
});
export const getters = {
    task: (s) => (taskId) => {
        let res = s.tasks.find( e => e.id == taskId);
        if (res && res.task) return res.task;
    },
    counter: s => s.counter,
    tasks: s => {
        let res = []
        for(const index in s.tasksNew) {
            res.push(s.tasksNew[index]);
        }
        return res
    }
};