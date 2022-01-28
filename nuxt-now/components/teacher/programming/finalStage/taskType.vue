<template>
    <div>
        <b-button-group>
            <b-button :active="type === 1" @click="type = 1" :variant="variant(1)">Обычная задача</b-button>
            <b-button :active="type === 2" @click="type = 2 " :variant="variant(2)">Задача с заданным шаблоном</b-button>
            <b-button v-if="type" @click="$emit('set-task-type',{type,check,solvedProgram})" variant="success">Сохранить</b-button>
        </b-button-group>
        <div v-if="solvedProgram && type===2">
            <h4>Создайте шаблон:</h4>
            <div  v-for="(e,i) in solvedProgram.split('\n')">
                <p class="program-span" v-if="!check[i]"><b-checkbox v-model="check[i]"/> <span v-html="i+1"/> <span class="program-text-span">{{e}}</span></p>
                <p class="program-span" v-else><b-checkbox v-model="check[i]"/> <span v-html="i+1"/> </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "taskType",

        props:['task'],

        data(){
            return{
                type: null,
                check:[],
            }
        },

        watch:{
          type: async function (val) {
              if (val === 2 ) await this.loadAttemps()
          },
        },
        computed:{
            taskId(){
                if (this.task ) return this.task._id
            },
            attemps(){
                if (this.task){
                    return this.$store.getters["teacher/programming/attemp/attempsResolve"](this.taskId)
                }
                return []
            },
            solvedAttemp(){
                if (this.task) return this.attemps.find( e => e._id === this.task.solvedAttemp)
            },
            solvedProgram(){
                if (this.solvedAttemp) return this.solvedAttemp.program
            }
        },

        mounted() {
            const {task} = this;
            if (task.type) this.type = task.type;
        },

        methods:{
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
            variant(number){
                if (this.type && this.type === number) return 'success';
                return ''
            }
        }
    }
</script>

<style scoped>
.program-span{
    display: inline-flex;
}
.program-text-span{
    margin-left: 20px;
}
</style>