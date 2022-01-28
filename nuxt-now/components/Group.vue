<template>
  <mdb-row class="group-item justify-content-end">
    <delete-group-confirm  :show='showDeleteModal' @close="showDeleteModal = false" @confirm="deleteGroup"/>
    <mdb-col col="5">
      <span v-html="group.name" />
    </mdb-col>
    <mdb-col col="4">
      <mdb-badge
          v-if="group.form"
          color="purple"
          tag="a"
      >{{group.form}} класс</mdb-badge>
    </mdb-col>
    <mdb-col col="2">
      <mdb-dropdown>
        <mdb-dropdown-toggle color="primary" slot="toggle">Действия</mdb-dropdown-toggle>
        <mdb-dropdown-menu color="primary">
          <mdb-dropdown-item @click="$router.push(`/teacherinterface/groups/${group._id}/tasks`)">Задания</mdb-dropdown-item>
          <mdb-dropdown-item @click="$router.push(`/teacherinterface/groups/${group._id}/users`)">Список учеников</mdb-dropdown-item>
          <mdb-dropdown-item @click="showDeleteModal = true">Удалить группу</mdb-dropdown-item>
        </mdb-dropdown-menu>
      </mdb-dropdown>
    </mdb-col>

  </mdb-row>
</template>

<script>
import DeleteGroupConfirm from "./UIcomponents/Modals/deleteGroupConfirm";
export default {
  name: "Group",
  components: {DeleteGroupConfirm},
  props: ["group"],

  data(){
    return {
      showDeleteModal: false
    }
  },

  methods:{
    async deleteGroup(){
      const {error, errorMessage} = await this.$store.dispatch('teacher/group/delete', this.group._id)
      if (!error) {
        this.showDeleteModal = false
        return this.$notify.success({
          title: 'Успех',
          message: 'Группа и ученики успешно удалены'
        })
      }
      return this.$notify.error({
        title: 'Ошибка',
        message: errorMessage
      })
    }
  }
}
</script>

<style scoped>
.group-item {
  border: 1px solid black;
  border-radius: 7px;
  margin: 10px 5px 10px 5px;
  background-color: aliceblue;
}
</style>
