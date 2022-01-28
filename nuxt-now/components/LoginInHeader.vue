<template>
  <div>
    <ul class="navbar-nav ml-auto list-inline">
      <div v-if="!$auth.loggedIn">
        <li class="nav-item">
          <nuxt-link to="/login" active-class="active" class="nav-link">
            Войти
          </nuxt-link>
        </li>
      </div>
      <div v-else>
        <li class="nav-item inline">
          Пользователь:
        </li>
        <li class="nav-item inline to-profile" @click="profile">
          {{ $auth.user.name }}
        </li>
        <li class="nav-link inline logout" @click="logout">
          Выйти
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LoginInHeader",
  methods: {
    profile() {
      this.$router.push("/profile")
    },
    logout() {
      this.$auth.logout()
      this.$router.go()
    },
  },
}
</script>

<style scoped>
.logout:hover {
  cursor: pointer;
}
.inline {
  display: inline;
}
.to-profile {
  cursor: pointer;
  color: #7f828b;
  text-decoration-color: #7f828b;
}
</style>
