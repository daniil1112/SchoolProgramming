<template>
    <div>
      <div class="input-group">
        <label>
          <input v-model="name" type="text" placeholder="Название группы" class="form-control">
        </label>
      </div>
      <button @click="create">Создать группу</button>
    </div>
</template>

<script>
    export default {
        name: "add",
        data: function () {
          return{
            name: null
          }
        },

        methods:{
          async create(){
            await this.$store.dispatch('group/addGroup',{
              name:this.name
            })
          }
        }
    }
</script>

<style scoped>

</style>
