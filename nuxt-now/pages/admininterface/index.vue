<template>
  <div>
    <el-button type="info" @click="programmingAttemps">
      К програмированию
    </el-button>
  </div>
</template>

<script>
export default {
  name: "Index",
  middleware: "authAdmin",
  methods: {
    programmingAttemps() {
      this.$router.push("/admininterface/programming/attemps/all")
    },
  },
}
</script>

<style scoped></style>
