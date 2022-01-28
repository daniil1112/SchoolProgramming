<template>
  <div>
    <div v-if="verdict && !verdict.empty">
      <el-alert
        v-if="verdict.verdict.points === verdict.verdict.maxPoints"
        type="success"
        :closable="false"
      >
        <div>Задача решена на {{ verdict.verdict.points }} баллов</div>
        <div>Задача решена полностью!!!</div>
      </el-alert>
      <el-alert
        v-if="verdict.verdict.points !== verdict.verdict.maxPoints"
        type="warning"
        :closable="false"
      >
        <div>Задача решена на {{ verdict.verdict.points }} баллов</div>
      </el-alert>
    </div>
    <div v-else>
      <el-alert type="success" :closable="false">
        <div>Задача не решена (0 баллов)</div>
      </el-alert>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainVerdict",
  props: ["verdict"],
}
</script>

<style scoped></style>
