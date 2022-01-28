<template>
  <div>
    <b-input-group>
      <b-input-group-prepend is-text>
        <i class="el-icon-edit" />
      </b-input-group-prepend>
      <b-form-input placeholder="Ответ" trim />
    </b-input-group>
    <b-form-text>
      Верный ответ: <b>{{ rightAnswer }}</b>
    </b-form-text>
  </div>
</template>
<script>
export default {
  name: "OpenAnswer",
  props: ["rightAnswer"],
}
</script>
