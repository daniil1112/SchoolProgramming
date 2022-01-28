<template />

<script>
import eventBus from "@/plugins/eventBus"
export default {
  name: "Alert",
  mounted() {
    eventBus
      .$on("error", (text) => {
        this.$message.error({
          message: `${text}`,
        })
      })
      .$on("success", (text) => {
        this.$message({
          message: `${text}`,
          type: "success",
        })
      })
  },
}
</script>

<style scoped></style>
