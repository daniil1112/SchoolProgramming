<template>
  <mdb-container>
    <mdb-card>
      <mdb-card-title class="center">Добавление темы</mdb-card-title>
      <mdb-card-body>
        <mdb-input v-model="text" label="Название темы" />
        <mdb-input type="number" v-model="form" label="Класс" :min="1" :max="11"/>
        <mdb-input type="textarea" v-model="details" label="Детали" :min="1" :max="11"/>
        <mdb-btn @click="save" variant="success">Добавить</mdb-btn>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
export default {
  name: 'add',

  data (){
    return {
      text: '',
      form: 1,
      details: '',
    }
  },




  methods:{
    toTheme(id){
      this.$router.push(`/teacherinterface/theme/${id}`)
    },
    async save(){
      const {text, form, details} = this
      const {theme, error, errorMessage} = (await this.$axios.post('/api/teacher/theme/add', {text, form, details})).data
      if (error) return this.$notify.error({
        title: 'Ошибка',
        message: errorMessage
      })

      if (theme) {
        let OBJ = this
        this.$toast.success('Усешно создано!', 'Успех', {
          position: 'topRight',
          timeout: 20000,
          buttons:[
            ['<button>Перейти</button>',() =>  {
              OBJ.toTheme(theme._id)
            }, true],
          ]
        })
      }
    }
  }
}
</script>

<style scoped>
.center{
  text-align: center
}
</style>