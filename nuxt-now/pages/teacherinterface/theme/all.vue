<template>
  <mdb-container>
    <mdb-card>
      <mdb-card-title>Список тем</mdb-card-title>
      <mdb-card-body>
        <el-table :data="themes">
          <el-table-column prop="_id" label="№" />
          <el-table-column prop="text" label="Название" />
          <el-table-column prop="form" label="Класс">
            <template slot-scope="scope">
              <el-tag
                  :type="getTypeForm(scope.row.form)"
                  effect="dark"
              >
                {{scope.row.form}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Действия">
            <template slot-scope="scope">
              <mdb-btn @click="toTheme">К теме</mdb-btn>
            </template>
          </el-table-column>
        </el-table>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
export default {
name: "all",

  data(){
    return{
      themes: []
    }
  },

  async mounted() {
    const {themes} = (await this.$axios.post('/api/teacher/theme/loadAll')).data
    if (themes) this.themes = themes
  },

  methods:{
    getTypeForm(form) {
      switch (form) {
        case 1:
          return ''
        case 2:
          return ''
        case 3:
          return ''
        case 4:
          return 'success'
        case 5:
          return 'success'
        case 6:
          return 'info'
        case 7:
          return 'info'
        case 8:
          return 'danger'
        case 9:
          return 'danger'
        case 10:
          return 'warning'
        case 11:
          return 'warning'

      }
    }
  }
}
</script>

<style scoped>

</style>