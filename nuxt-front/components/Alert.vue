<template>
    <div>
    <el-alert
      v-if="error"
      :title="error"
      type="error"
    />
      <el-alert
        v-if="success"
        :title="success"
        type="success"
      />
    </div>
</template>

<script>
    import eventBus from '@/plugins/eventBus'
    export default {
        name: "Alert",
      mounted() {
        eventBus.$on('error',(text) =>{
          this.success=null;
          this.error = text;
        }).$on('success',(text) =>{
          this.error=null;
          this.success = text
        })
      },
      data: function () {
        return{
          error: null,
          success:null
        }
      },

      methods:{
        closeError(){
          this.error = null;
        },
        closeSuccess()
        {
          this.success = null
        }
      }
    }
</script>

<style scoped>

</style>
