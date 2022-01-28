<template>
  <div>
    <v-card>
      <v-toolbar color="indigo" light>
        <v-toolbar-title>Ученики в группе</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="addStudent">
          <v-icon>el-icon-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <el-table v-if="users && users.length > 0" :data="users">
          <el-table-column label="id" prop="_id" />
          <el-table-column prop="login" label="Логин" />
          <el-table-column prop="name" label="Имя" />
          <el-table-column prop="lastip" label="Последний IP" />
          <el-table-column fixed="right" label="Действия">
            <template v-slot="scope">
              <el-button
                circle
                type="danger"
                size="small"
                @click="deleteStudent(scope)"
              >
                <v-icon>el-icon-delete</v-icon>
              </el-button>
              <el-button
                circle
                type="warning"
                size="small"
                @click="updateStudent(scope)"
              >
                <v-icon>el-icon-edit</v-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else>
          <p>Учеников в этой группе нет</p>
        </div>
      </v-container>
      <add-student :group="$route.params.group" />
      <update-student v-if="selectedUser" :groups="groups" :student="selectedUser" @hide="selectedUser = null"/>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"
import eventBus from "../../../../plugins/eventBus"
import AddStudent from "../../../../components/teacher/addStudent"
// import UpdateStudent from "../../../../components/teacher/updateStudent",
import UpdateStudent from '../../../../components/UIcomponents/Modals/updateStudent'
import ChangeStudentGroup from "../../../../components/teacher/changeStudentGroup"
export default {
  name: "users",
  components: { ChangeStudentGroup, AddStudent, UpdateStudent },
  layout: "teacher",
  middleware: "authTeacher",

  data: function () {
    return {
      registerShow: false,
      selectedUser: null
    }
  },
  mounted: async function () {
    await this.$store.dispatch('teacher/group/loadCounter')
    await this.$store.dispatch('teacher/group/loadGroups')
    await this.$store.dispatch("teacher/group/loadGroupUsers", {groupId: parseInt(this.$route.params.group), force: false})
  },

  computed: {
    users(){
      return this.$store.getters['teacher/group/students'](parseInt(this.$route.params.group))
    },
    groups(){
      return this.$store.getters['teacher/group/groups']
    }
  },

  methods: {
    addStudent() {
      eventBus.$emit("visibleRegisterStudent")
    },
    deleteStudent({ row }) {
      this.$confirm(`Удалить пользователя ${row.name}?`)
        .then(async (_) => {
          const result = await this.$store.dispatch(
            "group/deleteStudent",
            row._id
          )
          if (result.data.error) {
            let title = "Ошибка при удалении пользователя",
              message
            if (result.data.code === 1) {
              message = "Введенные данные имею неверный формат"
            } else if (result.data.code === 2) {
              message = "Ученик не найден"
            } else if (result.data.code === 3) {
              message = "Ошибка при обращении к группе"
            } else if (result.data.code === 4) {
              message = "Неизвестная ошибка"
            }

            this.$notify.error({ title, message })
          } else if (result.data.success) {
            this.$notify.success({
              title: "Успешное удаление",
              message: "Пользователь удален",
            })
            this.$store.dispatch("group/reloadGroupUsers")
          }
        })
        .catch((_) => {})
    },
    updateStudent({ row }) {
      let user = this.users.find((user) => user._id === row._id)

      if (!user) {
        return this.$notify.error({
          title: "Ошибка редактирования",
          message:
            "Пользователь не найден. Проверьте, не удален он, либо обновите страницу",
        })
      }

      eventBus.$emit("visibleUpdateStudent", user)

      this.selectedUser = user
    },
    async changeGroup({ row }) {
      let user = this.users.find((user) => user._id === row._id)

      if (!user) {
        return this.$notify.error({
          title: "Ошибка редактирования",
          message:
            "Пользователь не найден. Проверьте, не удален он, либо обновите страницу",
        })
      }

      eventBus.$emit("visibleChangeUserGroup", user)
    },
  },
}
</script>

<style scoped></style>
