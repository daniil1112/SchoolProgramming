<template>
  <mdb-container>
    <mdb-container v-if="!loading">
      <h1>Решение задачи</h1>
      <input-program v-if="lastAttemp && lastAttemp.programLang "
              :compiling="compiling"
              :langs="languages"
              :lang="lastAttemp.programLang"
              :code.sync="lastProgram"
              @export-program="addResolve" />
      <input-program v-else
                     :compiling="compiling"
                     :langs="languages"
                     :lang="1"
                     code.sync=""
                     @export-program="addResolve" />
      <attemps-table
              page="cc"
              :attemps="attemps"
      />
    </mdb-container>
    <mdb-container v-else>
      <div class="ph-item">
        <div class="ph-col-12">
          <div class="ph-picture"></div>
          <div class="ph-row">
            <div class="ph-col-6 big"></div>
          </div>
        </div>
      </div>
    </mdb-container>
  </mdb-container>
</template>

<script>
import InputProgram from "@/components/programming/InputProgram"
import AttempsTable from "@/components/programming/AttempsTable"
export default {
  name: "TaskResolve",
  props: ["task"],

  components: {
    InputProgram,
    AttempsTable,
  },

  data(){
    return {
      timeout: [],
      loading: true
    }
  },


  computed:{
    compiling(){
      return this.attemps.some( e => e.status !== 'compiled')
    },
    taskId(){
        if (this.task && this.task._id) return this.task._id;
    },
    attemps(){
      if (this.task){
        return this.$store.getters["teacher/programming/attemp/attempsResolve"](this.taskId)
      }
      return []
    },
    lastAttemp(){
      if (this.attemps.length > 0) return this.attemps[this.attemps.length - 1]
    },
    lastProgram(){
      if (this.lastAttemp) return this.lastAttemp.program
    },
    languages(){
      return this.$store.getters['teacher/programming/languages/languages']
    },
  },

  async mounted(){
    await this.loadAttemps();
    await this.loadLanguages();
    this.loading = false
  },

  methods:{
    async loadLanguages(){
      await this.$store.dispatch('teacher/programming/languages/loadLanguages')
    },
    async addResolve(data){
      const { error, errorMessage } = await this.$store.dispatch("teacher/programming/attemp/addResolve", {
        taskId: this.taskId,
        program: data.program,
        programLang: data.programLang
      });
      const title = 'Ошибка при добавлении программы';
      if ( error && errorMessage ) {
        return this.$notify.error({ title, message: errorMessage})
      } else if (error) return this.$notify.error({ title, message: 'Неизвестная ошибка'});
      this.timeout.push(setTimeout(this.reloadAttemps, 5000));
    },
    async loadAttemps() {
      const {error, errorMessage} = await this.$store.dispatch("teacher/programming/attemp/loadResolveAttemps", {
        taskId: this.taskId,
      });
      if (error && errorMessage){
        this.$notify.error({
          title: 'Произошла ошибка',
          message: errorMessage
        })
      }
      if (this.compiling) {
        this.timeout.push(setTimeout(this.reloadAttemps, 5000));
      }
    },
    async reloadAttemps(){
      const {solved} = await this.$store.dispatch("teacher/programming/attemp/reloadResolveAttemps", {
        taskId: this.taskId,
      });
      if (solved) {
        this.$notify.success({
          title: 'Входные данные добавлены',
          message: 'Решение сохранено'
        });
        this.$emit('reload-task');
      }
      if (this.compiling) this.timeout.push(setTimeout(this.reloadAttemps, 5000));
    },
  }


}
</script>

<style scoped>

</style>
