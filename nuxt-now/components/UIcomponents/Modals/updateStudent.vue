<template>
  <mdb-container>
    <mdb-modal @close="$emit('hide')">
      <mdb-modal-header> Изменение данных ученика </mdb-modal-header>
      <mdb-modal-body>
        <mdb-input
            label="Имя ученика"
            v-model="name"
            :isValid="validate.name === 1"
            :customValidation="validate.name > 0"
            :invalidFeedback="invalidNameFeedback"
            @input="validateName"
        />
        <mdb-input
            label="Логин"
            v-model="login"
            :isValid="validate.login === 1"
            :customValidation="validate.login > 0"
            :invalidFeedback="invalidLoginFeedback"
            @input="validateLogin"
        />
        <mdb-input
          type="checkbox"
          id="checkbox"
          name="checkbox"
          v-model="changePassword"
          label="Изменить пароль"
        />
        <mdb-input
            type="checkbox"
            id="changeGroupCheckbox"
            name="changeGroupCheckbox"
            v-model="changeGroup"
            label="Изменить группу"
        />
        <mdb-input
          v-if="changePassword && !showPassword"
          type="password"
          label="Пароль"
          v-model="password"
          :isValid="validate.password === 1"
          :customValidation="validate.password > 0"
          :invalidFeedback="invalidPasswordFeedback"
          @input="validatePassword"
        />
        <mdb-input
            v-if="changePassword && showPassword"
            type="text"
            label="Пароль"
            v-model="password"
        />
        <mdb-input
            v-if="changePassword"
            type="checkbox"
            id="checkbox2"
            name="checkbox2"
            v-model="showPassword"
            label="Посмотреть пароль"
        />
        <mdb-select
            v-if="changeGroup"
            color="primary"
            v-model="groupsModel"
            label="Выберите группу"
        />
        <mdb-btn :disabled="!allValid" @click="save">
          Сохранить
        </mdb-btn>
      </mdb-modal-body>

    </mdb-modal>
  </mdb-container>
</template>

<script>
export default {
  name: "updateStudent",
  props:['student','groups'],

  data(){
    return {
      validate: {
        password: 0,
        name: 0,
        login: 0
      },
      name: this.student.name,
      login: this.student.login,
      changePassword: false,
      changeGroup: false,
      showPassword: false,
      password: '',
      group: this.student.group,
      groupsModel: []
    }
  },


  computed:{
    invalidPasswordFeedback(){
      if (this.validate.password === 2) return 'Введите пароль'
      if (this.validate.password === 3) return 'Слишком короткий пароль'
      if (this.validate.password === 4) return 'Слишком длинный пароль'
    },

    invalidNameFeedback(){
      if (this.validate.name === 2) return 'Введите имя ученика'
      if (this.validate.name === 3) return 'Слишком короткое имя ученика'
      if (this.validate.name === 4) return 'Слишком длинное имя ученика'
    },
    invalidLoginFeedback(){
      if (this.validate.login === 2) return 'Введите логин ученика'
      if (this.validate.login === 3) return 'Слишком короткий логин ученика'
      if (this.validate.login === 4) return 'Слишком длинный логин ученика'
    },
    allValid(){
      return !(this.validate.name > 1 || this.validate.login > 1 || this.validate.password !== 1 && this.changePassword);
    }
  },


  mounted() {
    this.groups.forEach( e => {
      this.groupsModel.push({
        text: e.name,
        value: e._id,
        selected: e._id === this.group
      })
    })
    this.validateName();
    this.validateLogin()
  },


  methods:{
    validatePassword(){
      const {password} = this

      if (!password || password.length === 0) return this.validate.password = 2
      if (password.length < 6) return this.validate.password = 3
      if (password.length > 100) return this.validate.password = 4
      return this.validate.password = 1
    },
    validateName(){
      const {name} = this

      if (!name || name.length === 0) return this.validate.name = 2
      if (name.length < 3) return this.validate.name = 3
      if (name.length > 60) return this.validate.name = 4
      return this.validate.name = 1
    },
    validateLogin(){
      const {login} = this

      if (!login || login.length === 0) return this.validate.login = 2
      if (login.length < 3) return this.validate.login = 3
      if (login.length > 60) return this.validate.login = 4
      return this.validate.login = 1
    },

    async save(){
      const {name, login, password, changeGroup, changePassword} = this

      const group = this.groupsModel.find(e => e.selected).value

      if (!group) return this.$notify.error({
        title: 'Ошибка',
        message: 'Что-то пошло не так при выоре группы'
      })

      const {error, errorMessage } = await this.$store.dispatch('teacher/group/updateStudent', {
        defaultStudent: this.student,
        name,
        login,
        password,
        changeGroup,
        changePassword ,
        group,
        _id:this.student._id
      })

      if (!error) return this.$notify.success({
        title: 'Успех',
        message: 'Данные ученика изменены успешно'
      })

      return this.$notify.error({
        title: 'Ошибка',
        message: errorMessage
      })
    }
  }


}
</script>

<style scoped>

</style>