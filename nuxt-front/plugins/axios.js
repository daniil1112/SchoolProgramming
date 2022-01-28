export default function ({ $axios, redirect }) {
  $axios.onResponse(response => {
    if (response.data.authToken)  localStorage.setItem('authToken',response.data.authToken);
    if (response.data.refreshToken) {
      localStorage.setItem('authToken',response.data.refreshToken);
      return $axios.request(response.config);
    }
    if (response.data.redirect) redirect(200,response.data.redirect);

  });

  $axios.onError(error => {
    if (error.code == 401)  redirect(200,'/login')
  })

  $axios.onRequest(request => {
  if (localStorage.getItem('authToken')) request.headers.authToken = 'Bearer '+localStorage.getItem('authToken');
  })

}
