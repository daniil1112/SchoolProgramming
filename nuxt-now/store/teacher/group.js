let objFilter = require('object-filter')

export const actions = {
    async addGroup({ commit }, group) {
        return await this.$axios.post("/api/teacher/groups/addGroup", {
            name: group.name,
        })
    },
    async loadGroups({ commit, getters }) {
        if (getters['groups'].length !== getters['groupsCounter']) {
            try {
                const {groups, error, errorMessage} = (await this.$axios.post("/api/teacher/groups/all")).data
                if (!error) return commit('setGroups',groups)
                else console.error(errorMessage)

            } catch (e){
                return console.error(e)
            }
        }
    },
    async loadCounter({commit, getters}) {
        if (typeof getters['groupsCounter'] === 'undefined'){
            try {
                const {counter, error, errorMessage} = (await this.$axios.post("/api/teacher/groups/counter")).data
                if (!error) commit('setGroupsCounter',counter)
                else console.error(errorMessage)
            } catch (e) {
                console.error(e)
            }

        }
    },
    async add({commit}, data){
        let {name, form} = data;
        try {
            const {group, error, errorMessage} = (await this.$axios.post("/api/teacher/groups/addGroup", {name, form})).data
            if (!error) commit('addGroups',[group])
            else console.error(errorMessage)
            return {error, errorMessage}
        }catch (e) {
            console.error(e)
        }

    },

    async loadGroupUsers({ commit, state, getters }, data) {
        let {groupId, force} = data
        if (!getters['students'](groupId) || force) {
            try {
                const {users, error, errorMessage} = (await this.$axios.post("/api/teacher/groups/loadGroupUsers", {
                    groupId: groupId,
                })).data
                if (!error) commit('setStudents',{ students: users, group:groupId})
                return {error, errorMessage}
            } catch (e) {
                console.error(e)
            }

        }
    },

    async delete( {commit}, groupId ) {
        try {
            const {error, errorMessage} = (await this.$axios.post("/api/teacher/groups/delete", {groupId})).data
            if (!error) commit('deleteGroup', groupId)
            return {error, errorMessage}
        } catch (e) {
            console.error(e)
        }

    },

    async updateStudent({commit, dispatch} , data) {
        const {defaultStudent} = data
        const {error, errorMessage, changeGroup, student} = (await this.$axios.post("/api/teacher/groups/updateStudent", data)).data
        if (!error){
            try {
                if (changeGroup) {
                    commit('unsetStudentFromGroup', defaultStudent)
                    await dispatch('loadGroupUsers', {groupId: student.group, force: true})
                } else {
                    commit('updateStudent', student)
                }

            } catch (e) {
                return console.error(e)
            }

        }
        return {error, errorMessage}
    }

}
export const mutations = {
    setGroups(state, groups){
        state.groups = groups
    },
    setGroupsCounter(state, counter){
        state.groupsCounter = counter
    },
    addGroups(state, groups){
        groups.forEach( e => state.groups.unshift(e))
    },
    setStudents(state, data){
        const { students, group } = data;
        state.students[group] = students
        const res = state.students
        state.students = {}
        state.students = {...res}
    },
    deleteGroup(state, groupId){
        const groups = state.groups.filter(e => e._id !== groupId)
        state.groups = {}
        state.groups = {...groups}
        state.students[groupId] = undefined
        const res = state.students
        state.students = {}
        state.students = {...res}
    },
    unsetStudentFromGroup(state, student) {
        state.students[student.group] = state.students[student.group].filter( e => e._id !== student._id);
        state.students = {...state.students}
    },
    updateStudent(state, student) {
        state.students[student.group] = (state.students[student.group]).filter( e => e._id !== student._id);
        state.students[student.group].push(student);
        state.students = {...state.students}
    }

}

export const state = () => ({
    groupsCounter: undefined,
    groups: {},
    students: {},
})
export const getters = {
    groups: (s) => s.groups,
    groupsCounter: (s) => s.groupsCounter,
    students: (s) => (group) => s.students[group]
}
