export default function ({ app, redirect }) {
  // If the user is not authenticated

  if (!app.$auth.loggedIn || app.$auth.user.state < 2) {
    return redirect("/")
  }
}
