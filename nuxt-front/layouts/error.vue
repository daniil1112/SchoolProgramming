<template>
  <div>{{error.statusCode}} Ошибка</div>
</template>

<script>
    export default {
        name: "error",
        props: ['error'],
        layout: "default",
    }
</script>

<style scoped>

</style>
