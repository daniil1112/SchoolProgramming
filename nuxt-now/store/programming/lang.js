export const actions = {
    async loadLangs({ commit, state }, force = false){
        if (state.langs && state.langs.length > 0 && !force) return
        try {
            const {langs} =(await this.$axios.get('api/teacher/programming/loadLangs')).data;
            commit('setLangs',langs)
        } catch (e) {
            console.error(e)
        }

    }
}
export const mutations = {
    setLangs(state, langs) {
        if (langs){
            state.langs = []
            langs.forEach(e => {
                state.langs.push({
                    value: e._id,
                    label: e.label
                })
            })
        }

    },
}

export const state = () => ({
    langs:[]
})
export const getters = {
    all: (s)=>s.langs
}
