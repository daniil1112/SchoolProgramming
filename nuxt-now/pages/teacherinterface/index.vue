<template>
  <div>
    Главная страница
  </div>
</template>

<script>
export default {
  name: "Index",
  middleware: "authTeacher",
  layout: "teacher",
}
</script>

<style scoped></style>
