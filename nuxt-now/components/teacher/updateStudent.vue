<template>
  <div>
    <el-dialog
      title="Изменение данных"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form ref="formUpdate" :model="user" :rules="rules">
        <el-form-item prop="name" label="Имя ученика">
          <el-input v-model="user.name" placeholder="ФИО" />
        </el-form-item>
        <el-form-item prop="login" label="Логин">
          <el-input v-model="user.login" placeholder="test" />
        </el-form-item>
        <el-checkbox v-model="changePassword">
          Изменить пароль
        </el-checkbox>
        <el-form-item v-if="changePassword" prop="password" label="Пароль">
          <el-input
            v-model="user.password"
            placeholder="12345678"
            show-password
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideForm">Отменить</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="update('formUpdate')"
          >Изменить</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "../../plugins/eventBus"
export default {
  name: "UpdateStudent",

  data() {
    return {
      loading: false,
      visible: false,
      changePassword: false,
      user: {
        name: null,
        login: null,
        password: null,
        id: null,
      },
      rules: {
        login: [
          { required: true, message: "Введите логин", trigger: "blur" },
          { min: 2, message: "Слишком короткий логин", trigger: "blur" },
          { max: 50, message: "Слишком длинный логин", trigger: "blur" },
        ],
        password: [
          { required: true, message: "Введите пароль", trigger: "blur" },
          { min: 6, message: "Слишком короткий пароль", trigger: "blur" },
        ],
        name: [
          {
            required: true,
            message: "Введите имя пользователя",
            trigger: "blur",
          },
          { min: 6, message: "Слишком короткое имя", trigger: "blur" },
          { max: 70, message: "Слишком длинное имя", trigger: "blur" },
        ],
      },
    }
  },

  mounted() {
    eventBus.$on("visibleUpdateStudent", (user) => {
      this.user = {
        name: user.name,
        login: user.login,
        id: user._id,
      }
      this.visible = true
    })
  },

  methods: {
    hideForm() {
      this.visible = false
    },
    async update(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let result = await this.$store.dispatch("group/updateStudent", {
            updatePassword: this.changePassword,
            name: this.user.name,
            login: this.user.login,
            password: this.user.password,
            userId: this.user.id,
          })
          if (result.data.error) {
            let message,
              title = "ОШибка при изменении пользователя"
            if (result.data.code === 1) {
              message = "Введенные данные имеют неверный формат"
            } else if (result.data.code === 2) {
              message = "Ученик не найден"
            } else if (result.data.code === 3) {
              message = "Вы не имеете доступа к группе"
            } else if (result.data.code === 4) {
              message = "Неизвестная ошибка"
            }

            this.$notify.error({ title, message })
          } else if (result.data.success) {
            this.$notify.success({
              title: "Успешное изменение",
              message: "Данные пользователя обновлены",
            })
            this.hideForm()
            this.$store.dispatch("group/reloadGroupUsers")
          }
          this.loading = false
        }
      })
    },

    handleClose(done) {
      this.$confirm("Отменить изменение ?")
        .then((_) => {
          this.clearForm()
          done()
        })
        .catch((_) => {})
    },
  },
}
</script>

<style scoped></style>
