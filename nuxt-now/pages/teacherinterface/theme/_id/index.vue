<template>
  <mdb-container>
    <mdb-card v-if="theme">
      <mdb-card-title>Тема {{theme.text}}</mdb-card-title>
      <mdb-card-body>
        <small>{{theme.defails}}</small>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
export default {
  name: "index",

  data(){
    return {
      theme: false
    }
  },

  async mounted() {
    await this.loadTheme()
  },

  methods:{
    async loadTheme(){
      const {theme} = (await this.$axios.post('/api/teacher/theme/load', {_id: this.$route.params.id})).data
      if (theme) this.theme = theme
    }
  }
}
</script>

<style scoped>

</style>