<template>
  <mdb-container>
    <group-add-modal :show="addGroupModal" @hide="addGroupModal = false" />
    <mdb-card>
      <mdb-card-body>
        <mdb-card-title class="text-center pb-0" cascade>
          <span>Список групп</span>
          <mdb-btn v-if="!loading" tag="a" size="lg" floating class="btn-fb" icon="plus" @click="addGroupModal = true"></mdb-btn>
          <hr>
        </mdb-card-title>
        <mdb-list-group>
          <mdb-list-group-item color="secondary" v-if="!loading">
            <mdb-row v-if="groups.length > 0">
              <mdb-col md="12">
                <Group
                    v-for="group in groups"
                    :group = 'group'
                />
              </mdb-col>
            </mdb-row>
            <mdb-row v-else>
              Группы не найдены. <a href="#" @click="addGroupModal = true">Добавить</a>
            </mdb-row>
          </mdb-list-group-item>
          <mdb-container v-else>
            <div class="ph-item">
              <div class="ph-col-12">
                <div class="ph-picture"></div>
              </div>
            </div>
          </mdb-container>
        </mdb-list-group>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import Group from "@/components/Group"
import GroupAddModal from "../../../components/UIcomponents/Modals/groupAddModal";
export default {
  layout: "teacher",
  middleware: "authTeacher",
  name: "All",
  components: {
    GroupAddModal,
    Group,
  },
  data(){
    return{
      addGroupModal: false,
      loading: true
    }
  },
  computed: {
    groups() {
      return this.$store.getters["teacher/group/groups"]
    },
    counter(){
      return this.$store.getters['teacher/group/groupsCounter']
    }
  },
  mounted: async function () {
    await this.$store.dispatch('teacher/group/loadCounter')
    await this.$store.dispatch("teacher/group/loadGroups")
    this.loading = false
  },
  head: {
    title: "Список всех групп",
  },
}
</script>

<style scoped></style>
