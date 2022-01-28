export default function ({ $axios, redirect, app, store }) {
  $axios.onResponse((response) => {
    if (response.data.refreshToken) {
      if (response.data.refreshToken === "") {
        app.$auth.logout()
      } else {
        let token
        app.$auth.setToken("local", response.data.refreshToken)
        token = app.$cookies.get("auth._token.local")
        token = localStorage.getItem("auth._token.local")
        if (token) {
          response.config.headers["Authorization"] = token
          $axios.defaults.headers.common.Authorization = token
          app.store.commit("loading/end")
          return $axios.request(response.config)
        }
      }
    }
    if (response.data.redirect) redirect(200, response.data.redirect);
    app.store.commit("loading/end")
  })

  $axios.onError((error) => {
    if (error.code === 401) redirect(200, "/login")
    app.store.commit("loading/end")
  })

  $axios.onRequest((request) => {
    app.store.commit("loading/start")
  })
}
