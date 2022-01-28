<template>
  <div>
      <div class="groups-all-title"> Список всех выших групп </div>
    <Group v-for="group in groups"
           v-bind:groupid="group._id"
           v-bind:key="group._id"
           v-bind:name="group.name"
    />
  </div>
</template>

<script>
    import Group from "@/components/Group"
    export default {
        name: "all",
        components:{
          Group,
        },
        head:{
          title:'Список всех групп',
        },
        mounted: async function() {
          await this.$store.dispatch('right/AllGroups');
          await this.$store.dispatch('group/loadGroups')
        },
        computed:{
          groups(){
            return this.$store.getters['group/groups']
          },
        },
    }
</script>

<style scoped>

</style>
