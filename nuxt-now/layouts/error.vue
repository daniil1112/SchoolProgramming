<template>
  <div>{{ error.statusCode }} Ошибка</div>
</template>

<script>
export default {
  name: "Error",
  props: ["error"],
  layout: "default",
}
</script>

<style scoped></style>
