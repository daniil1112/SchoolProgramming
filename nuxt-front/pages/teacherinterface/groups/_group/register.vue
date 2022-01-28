<template>
    <div>
      <div v-if="access">
      <div class="input-group">
        <label>
          <input v-model="user.name" type="text" placeholder="Полное имя" class="form-control">
        </label>
      </div>
      <div class="input-group">
        <label>
          <input v-model="user.login" type="text" placeholder="Логин для входа" class="form-control">
        </label>
      </div>
      <div class="input-group">
        <label>
          <input v-model="user.password" type="text" placeholder="Пароль" class="form-control">
        </label>
      </div>
      <button @click="register" @dblclick="register">Зарегистрировать</button>
      </div>
    </div>
</template>

<script>
    export default {
        name: "register",
        data: function () {
          return {
            user: {
              name: null,
              login: null,
              password: null,
            }
          }
        },
      mounted: async function () {
        await this.$store.dispatch('right/UpdateGroup',this.$route.params.group)
      },


      computed:{
          group(){
            return this.$route.params.group
          },
          access()
          {
            return this.$store.getters['right/rights'].updateGroup
          }
        },
        methods:{
          async register(){
            await this.$store.dispatch('user/registerQuery',{
              name: this.user.name,
              login: this.user.login,
              password: this.user.password,
              group: this.group
            });}
        }
    }
</script>

<style scoped>

</style>
