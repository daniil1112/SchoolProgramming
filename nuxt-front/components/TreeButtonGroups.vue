<template>

<div class="btn-group">
  <button type="button" class="btn btn-danger">Action</button>
  <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click ="toggleExpand">
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <div class="dropdown-menu show" v-if="expanded">
    <nuxt-link :to="id" class="dropdown-item">Список учеников</nuxt-link>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Separated link</a>
  </div>
</div>
</template>

<script>
    export default {
      name: "TreeButtonGroups",
      props:['groupid'],
      data:function () {
        return{
          expanded:false,
          id: '/teacherinterface/groups/'+this.groupid+'/users'
        }
      },
      methods:{
          toggleExpand(){
            this.expanded = !this.expanded
          }
      }

    }
</script>

<style scoped>

</style>
