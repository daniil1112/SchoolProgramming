<template>
  <div>
    <div v-if="canCreateTask">
    <div class="input-group">
      <label>
        <input v-model="task.shortTitle" type="text" placeholder="Короткий заголовок" class="form-control">
      </label>
    </div>
    <div class="input-group">
      <label>
        <input v-model="task.title" type="text" placeholder="Заголовок" class="form-control">
      </label>
    </div>
    <div class="input-group">
      <label>
        <input v-model="task.body" type="text" placeholder="Текст задания" class="form-control">
      </label>
    </div>
    <button @click="save">Создать</button>
    </div>
    <div v-else>
      <div class = " Alert danger">Вам запрещено это делать</div>
    </div>
  </div>
</template>

<script>

    export default {
        name: "new",
      mounted: async function(){
        await this.$store.dispatch('right/CreateTask');
      },
      computed:{
        canCreateTask(){
          return this.$store.getters['right/rights'].createTask;
        }
      },
      data: function () {
        return{
          task: {
            shortTitle: null,
            title: null,
            body: null
          }
        }
      },
      methods:{
          async save()
          {
            await this.$store.dispatch('task/addTask',this.task);
          }
      }
    }
</script>

<style scoped>

</style>
