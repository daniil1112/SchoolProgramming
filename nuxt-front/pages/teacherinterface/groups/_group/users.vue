<template>
  <div>
    <div v-if="access">
      {{users}}
    </div>
  </div>
</template>

<script>
  export default {
    name: "register",
    mounted: async function () {
      await this.$store.dispatch('right/UpdateGroup',this.$route.params.group);
      await this.$store.dispatch('user/loadGroupUsers',this.$route.params.group)
    },


    computed:{
      access()
      {
        return this.$store.getters['right/rights'].updateGroup
      },
      users()
      {
        return this.$store.getters['user/users']
      }
    },
  }
</script>

<style scoped>

</style>
