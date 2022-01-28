import eventsBus from "@/plugins/eventBus"
export const mutations = {
  start(state) {
    state.loading = state.loading + 1
  },
  end(state) {
    state.loading = state.loading - 1
    if (state.loading < 0) state.loading = 0
  },
}

export const state = () => ({
  loading: 0,
})

export const getters = {
  loading: (s) => s.loading,
}
