<template>
  <mdb-container>
    <mdb-modal :show="show" @close="$emit('hide')" centered>
      <mdb-modal-header class="text-center">
        <mdb-modal-title tag="h4" bold class="w-100">Новая группа</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body class="mx-3 grey-text">
        <mdb-input
            label="Название группы"
            icon="address-book"
            type="text"
            class="mb-5"
            required
            v-model="name"
            :isValid="validate.name === 1"
            :customValidation="validate.name > 0"
            :invalidFeedback="invalidFeedbackName"
            @change="validateName"
        />
        <mdb-select
            v-model="selectFormOptions"
            icon="users"
            placeholder="Выберите класс"
            label="Класс" />
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn gradient="green" block rounded @click.native="addGroup">Добавить</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </mdb-container>
</template>

<script>
export default {
  name: "groupAddModal",
  props:['show'],
  data(){
    return{
      name: '',
      form: null,
      validate: {
        name: 0,
      },
      selectFormOptions:[
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
        { text: '7', value: '7' },
        { text: '8', value: '8' },
        { text: '9', value: '9' },
        { text: '10', value: '10' },
        { text: '11', value: '11' },
      ],
      loading: false,
    }
  },
  computed:{
    invalidFeedbackName() {
      if (this.validate.name === 1) return ""
      else if (this.validate.name === 2) return "Введите логин"
      else if (this.validate.name === 3) return "Слишком короткий логин"
      else if (this.validate.name === 4) return "Слишком длинный логин"
    },
  },
  watch:{
    selectFormOptions(){
      const res = this.selectFormOptions.find(e => e.selected);
      if (res) return this.form = res.value
      return this.form = null
    }
  },
  methods:{
    validateName() {
      let {name} = this
      if (name.length === 0) this.validate.name = 2
      else if (name.length < 3) this.validate.name = 3
      else if (name.length >= 50) this.validate.name = 4
      else this.validate.name = 1
    },

    setDefault(){
      this.name = ''
      this.form = null;
      this.validate.name = 0
      this.selectFormOptions = [
        { text: '1', value: '1' },
        { text: '2', value: '2' },
        { text: '3', value: '3' },
        { text: '4', value: '4' },
        { text: '5', value: '5' },
        { text: '6', value: '6' },
        { text: '7', value: '7' },
        { text: '8', value: '8' },
        { text: '9', value: '9' },
        { text: '10', value: '10' },
        { text: '11', value: '11' },
      ]
    },

    async addGroup() {
      this.validateName();
      const {name, form} = this

      if (this.validate.name !== 1) {
        return this.$notify.error({
          title: 'Ошибка',
          message: 'Проверьте введенные данные'
        })
      }

      const {error, errorMessage} = await this.$store.dispatch('teacher/group/add',{name,form} );

      if (error) {
        return this.$notify.error({
          title: 'Ошибка при добавлении',
          message: errorMessage
        })
      }

      this.setDefault()

      this.$emit('hide')

      return this.$notify.success({
        title: 'Успех',
        message: 'Группа добавлена'
      })
    }
  }
}
</script>

<style scoped>

</style>