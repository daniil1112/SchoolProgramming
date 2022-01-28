export const actions = {
    async loadLanguages( {state, commit} ){
        if (!state.languages || state.languages.length === 0 ){
            try {
                let {langs} = (await this.$axios.get("/api/student/programming/loadLanguages")).data;
                if (langs) commit('setLanguages',langs)
            } catch (e) {
                console.error(e)
            }
        }
    }
}
export const mutations = {
    setLanguages(state, data) {
        console.log(data)
        state.languages = data
    },
}

export const state = () => ({
    languages: [],
})
export const getters = {
    languages: (s) => (array) => s.languages.filter((e) => array.some (n => n === e._id)),
}
