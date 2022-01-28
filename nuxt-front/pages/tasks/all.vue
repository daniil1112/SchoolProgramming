<template>
    <div>
      <div class="task" v-for="(task, index) in tasks">
        <nuxt-link v-bind:to="task.slug"><h3>{{index}} --- {{task.shortTitle}}</h3></nuxt-link>
      </div>
      <div v-if="canCreateTask">Создать задачечку</div>
    </div>
</template>

<script>
    export default {
        name: "all",
      mounted: async function(){
          await this.$store.dispatch('task/loadTasks');
          await this.$store.dispatch('right/CreateTask');
      },
      computed:{
          tasks(){
            return this.$store.getters['task/tasks'];
          },
          canCreateTask(){
            return this.$store.getters['right/rights'].createTask;
          }
      },

    }
</script>

<style scoped>

</style>
