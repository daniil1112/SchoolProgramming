<template>
  <el-dialog
    title="Регистрация"
    :visible.sync="visible"
    :before-close="hideForm"
  >
    <el-table :data="groups">
      <el-table-column prop="_id" label="Номер" />
      <el-table-column prop="name" label="Название" />
      <el-table-column>
        <template slot-scope="scope">
          <el-button
            v-if="scope.row._id !== startGroup"
            @click="changeGroupUser(scope)"
          >
            Выбрать
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideForm">Отменить</el-button>
    </span>
  </el-dialog>
</template>

<script>
import eventBus from "../../plugins/eventBus"
export default {
  name: "ChangeStudentGroup",
  props: {
    startGroup: Number,
  },
  data() {
    return {
      visible: false,
      user: {
        id: "",
        name: "",
      },
    }
  },

  computed: {
    groups(){
      return this.$store.getters['teacher/group/groups']
    },
  },

  mounted() {
    eventBus.$on("visibleChangeUserGroup", async (user) => {
      await this.$store.dispatch('teacher/group/loadCounter')
      await this.$store.dispatch('teacher/group/loadGroups')
      this.visible = true
      this.user = {
        id: user._id,
        name: user.name,
      }
    })
  },

  methods: {
    clearUser() {
      this.user = {
        id: "",
        name: "",
      }
    },
    changeGroupUser({ row }) {
      this.$confirm(`Изменить группу пользователю  ${this.user.name}?`)
        .then(async (_) => {
          const result = await this.$store.dispatch(
            "group/changeStudentGroup",
            {
              newGroup: row._id,
              userId: this.user.id,
            }
          )
          if (result.data.error) {
            let message,
              title = "ОШибка при изменении группы пользователя"
            if (result.data.code === 1) {
              message = "Введенные данные имеют неверный формат"
            } else if (result.data.code === 2) {
              message = "Ученик не найден"
            } else if (result.data.code === 3 || result.data.code === 4) {
              message = "Вы не имеете доступа к группе"
            } else if (result.data.code === 5) {
              message = "Неизвестная ошибка"
            }
            this.$notify.error({ title, message })
          } else if (result.data.success) {
            this.$notify.success({
              title: "Изменено успешно",
              message: "Группа пользователя изменена",
            })
            this.$store.dispatch("group/reloadGroupUsers")
            this.hideForm()
          }
        })
        .catch((_) => {})
    },
    hideForm() {
      this.clearUser()
      this.visible = false
    },
  },
}
</script>

<style scoped></style>
