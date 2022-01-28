<template>
  <mdb-container>
    <mdb-modal :show="show" @close="$emit('close')" size="sm" class="text-center" danger>
      <mdb-modal-header center :close="false">
        <p class="heading">Вы уверены?</p>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-icon icon="times" size="4x" class="animated rotateIn"/>
        <p><span>Группа и её ученики будут удалены безвозвратно.</span></p>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn outline="success" @click="$emit('confirm')">Да</mdb-btn>
        <mdb-btn color="danger" @click="$emit('close')">Отменить</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>
export default {
  name: "deleteGroupConfirm",
  props: ['show']
}
</script>

<style scoped>

</style>