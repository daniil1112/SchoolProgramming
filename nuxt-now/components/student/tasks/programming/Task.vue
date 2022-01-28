<template>
  <div>
    <div>
      <h1>{{ task.title }}</h1>
    </div>
    <div>
      <h4>{{ task.task }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: "Task",
  props: ["task"],
}
</script>

<style scoped></style>
