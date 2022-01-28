<template>
  <div>
    Список всех материаллов учителя
  </div>
</template>

<script>
export default {
  name: "Interface",
  middleware: "authTeacher",
  layout: "teacher",
}
</script>

<style scoped></style>
