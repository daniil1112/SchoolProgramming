<template>
    <div>
      <div class="input-group">
        <label>
          <input v-model="user.login" type="text" placeholder="Логин" class="form-control">
        </label>
      </div>
        <div class="input-group">
          <label>
            <input v-model="user.password" type="password" placeholder="password" class="form-control">
          </label>
        </div>
      <button class="btn btn-secondary" @click="login">Подтвердить</button>
    </div>
</template>

<script>
    export default {
        name: "login",

      data:function () {
        return{
          user:{
            login: null,
            password: null,
          }
        }
      },

      computed: {},
      methods:{
          async login(){
            await this.$store.dispatch('user/loginQuery',this.user);
          }
      }
    }
</script>

<style scoped>

</style>
