<template>
  <div>
    <nuxt-link to="new">Новый блок тестов</nuxt-link>
    <div v-if="blocks">
      <div v-for="block in blocks">
       <p>Блок: <span v-html="block.title"/>   <nuxt-link :to="block._id+''"><button>открыть блок</button></nuxt-link></p>  <!-- Супер-ужасный костыль!!!(исправлю в течение нескольких дней)-->
      </div>
    </div>
    <div v-else>Пусто пока!</div>
  </div>

</template>

<script>
    export default {
        name: "list",
        mounted: async function() {
          await this.$store.dispatch('groupTests/allBlocks');
       },
      computed:{
        blocks()
        {
          return this.$store.getters['groupTests/blocks']
        }
      },
      methods:{
      }

    }

</script>

<style scoped>

</style>
