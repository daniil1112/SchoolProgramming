<template>
  <div class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">LOGO</a>
    <v-spacer />
    <div>
      <LoginInHeader />
    </div>
  </div>
</template>

<script>
import LoginInHeader from "./LoginInHeader"
export default {
  name: "Navbar",
  components: { LoginInHeader },
}
</script>

<style scoped></style>
