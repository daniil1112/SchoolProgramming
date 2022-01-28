<template>
  <div class="container">
    Возможность зайти как : <span v-if="state >= 1"><nuxt-link to="/userinterface">Ученик</nuxt-link></span> <span v-if="state >= 2"><nuxt-link to="/teacherinterface">Учитель  </nuxt-link></span> <span v-if="state >= 3">Модератор(завуч)  </span>  <span v-if="state >= 4">Разработчик </span>
  </div>
</template>

<script>

export default {
  computed:{
    state(){
      return this.$store.getters['user/user'].state;
    }
  }
}
</script>

<style>

</style>
