<template />

<script>
import eventsBus from "@/plugins/eventBus"
export default {
  name: "Notify",
  mounted() {
    eventsBus.$on("error", (data) => {
      this.$notify.error({
        title: data.title,
        message: data.message,
      })
    })
  },
}
</script>

<style scoped></style>
