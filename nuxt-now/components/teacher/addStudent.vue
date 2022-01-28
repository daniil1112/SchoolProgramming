<template>
  <div>
    <el-dialog
      title="Регистрация"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form ref="formRegister" :model="user" :rules="rules">
        <el-form-item prop="name" label="Имя ученика">
          <el-input v-model="user.name" placeholder="ФИО" />
        </el-form-item>
        <el-form-item prop="login" label="Логин">
          <el-input v-model="user.login" placeholder="test" />
        </el-form-item>
        <el-form-item prop="password" label="Пароль">
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
          @click="register('formRegister')"
          >Добавить</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from "../../plugins/eventBus"
export default {
  name: "AddStudent",
  props: ["group"],

  data() {
    return {
      loading: false,
      visible: false,
      user: {
        name: null,
        login: null,
        password: null,
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
    eventBus.$on("visibleRegisterStudent", () => {
      this.visible = true
    })
  },

  methods: {
    clearForm() {
      this.user = {
        name: null,
        login: null,
        password: null,
      }
    },
    hideForm() {
      this.clearForm()
      this.visible = false
    },
    async register(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let result = await this.$store.dispatch("user/registerQuery", {
            name: this.user.name,
            login: this.user.login,
            password: this.user.password,
            group: this.group,
          })
          if (result.data.error) {
            let title = "Ошибка при добавлении пользователя",
              message
            if (result.data.code === 1) {
              message = "Введенные данные имею неверный формат"
            } else if (result.data.code === 2) {
              message = "У вас нет доступа к этой группе"
            } else if (result.data.code === 3) {
              message = "Пользователь с данным логином уже существует"
            } else if (result.data.code === 4) {
              message = "Неизвестная ошибка"
            }

            this.$notify.error({ title, message })
          } else if (result.data.success) {
            this.$notify.success({
              title: "Успешное добавление",
              message: "Пользователь добавлен в группу",
            })

            this.hideForm()

            this.$store.dispatch("group/reloadGroupUsers")
          }
          this.loading = false
        }
      })
    },

    handleClose(done) {
      this.$confirm("Отменить создание ?")
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
