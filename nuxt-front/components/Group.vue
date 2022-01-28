<template>
  <div class = "group-item row">
    <div class="group-item-name col-md-8" v-html="name" />
    <div class="button-modified ml-auto col-md-2"><TreeButtonGroups v-bind:groupid="groupid"/></div>
  </div>
</template>

<script>
  import TreeButtonGroups from '@/components/TreeButtonGroups'
    export default {
        components:{
          TreeButtonGroups
        },
        props:['name','groupid'],
        name: "Group",

    }
</script>

<style scoped>
.group-item{
  border: 1px solid black;
  border-radius: 7px;
  margin: 10px 5px 10px 5px;
  background-color: aliceblue;
}
.group-item-name{
  margin: 0 0 0 15px;
}
</style>
