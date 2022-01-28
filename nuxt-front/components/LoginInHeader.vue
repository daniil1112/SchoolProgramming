<template>
    <div>
      <client-only>
      <ul class="navbar-nav ml-auto  list-inline">

        <div v-if="!userName">
          <li class="nav-item"><nuxt-link to="/login" v-if="!userName" active-class="active" class="nav-link">
            Войти
          </nuxt-link></li>
        </div>
        <div v-else >
          <li class="nav-item inline">Пользователь:  </li>
          <li class="nav-item inline to-profile" @click="profile">{{userName}}</li>
          <li class="nav-link inline logout"  @click="logout">Выйти </li>
        </div>
      </ul>
      </client-only>
    </div>

</template>

<script>
    export default {
        name: "LoginInHeader",
      computed:{
        userName()
          {
             return this.$store.getters['user/user'].name;
          }
      },

      methods:{
        async logout(){
          await this.$store.dispatch('user/logout');
        },
        profile(){
          this.$router.push('/profile')
        }
      }
    }
</script>

<style scoped>
  .logout:hover{
    cursor: pointer;
  }
  .inline{
    display: inline;
  }
  .to-profile{
    cursor: pointer;
    color: #7F828B;
    text-decoration-color: #7f828b;
  }
</style>
