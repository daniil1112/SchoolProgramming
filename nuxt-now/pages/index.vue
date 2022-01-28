<template>

  <div class="container">
    <el-button
      v-show="state === 1"
      size="medium"
      type="warning"
      @click="$router.push('/userinterface')"
    >

      Кабинет ученика
    </el-button>
    <el-button
      v-show="state >= 2"
      size="medium"
      type="success"
      @click="$router.push('/teacherinterface')"
    >
      Кабинет учителя
    </el-button>
    <el-button
      v-show="state >= 4"
      size="medium"
      type="primary"
      @click="$router.push('/admininterface')"
    >
      Кабинет администратора
    </el-button>
  </div>
</template>

<script>

export default {
  computed: {
    state() {
      if (this.$auth.loggedIn) {
        return this.$auth.user.state
      }
      return 0
    },
  },
  head: {
    title: "Главная страница",
  },
}
</script>

<style></style>
