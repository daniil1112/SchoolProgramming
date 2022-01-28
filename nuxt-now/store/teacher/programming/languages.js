export const actions = {
    async loadLanguages( {state, commit} ){
        if (!state.languages || state.languages.length === 0 ){
            try {
                let {languages} = (await this.$axios.get("/api/teacher/programming/languages/load")).data;
                if (languages) commit('setLanguages',languages)
            } catch (e) {
                console.error(e)
            }
        }
    }
}
export const mutations = {
    setLanguages(state, data) {
        state.languages = data
    },
}

export const state = () => ({
    languages: [],
})
export const getters = {
    languages: (s)  => s.languages.filter((e) => e.active),
}
