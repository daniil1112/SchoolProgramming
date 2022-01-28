<template>
  <div>
    <div v-for="sample in samples">
      <span>Ввод</span>
      <span style="margin-left: 45%;">Вывод</span>
      <div>
        <el-input
          v-model="sample.input"
          :readonly="true"
          style="max-width: 48%;"
        />
        <el-input
          v-model="sample.output"
          :readonly="true"
          style="max-width: 48%;"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Samples",
  props: ["samples"],
}
</script>

<style scoped></style>
