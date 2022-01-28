<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">LOGO</a>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <nuxt-link class="nav-link" active-class="active" exact to="/">Home</nuxt-link>
        </li>
        <li v-if="auth" class="nav-item">
          <nuxt-link class="nav-link" active-class="active" to="/tasks/all">Задачи</nuxt-link>
        </li>
      </ul>
        <LoginInHeader />
    </div>
  </nav>
</template>

<script>

  import LoginInHeader from "./LoginInHeader";
    export default {
        name: "Navbar",
        components: {LoginInHeader},
        mounted: async function () {
          await this.$store.dispatch('user/checkLogin');
        },
        computed:{
          auth(){
            return this.$store.getters['user/user'].name;
          }
        }
    }
</script>

<style scoped>

</style>
