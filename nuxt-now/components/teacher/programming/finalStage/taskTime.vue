<template>
    <div v-if="task">
        <b-button-group>
            <b-button :active="type === 1" @click="type = 1" :variant="variant(1)">Автоматическая настройка</b-button>
            <b-button :active="type ===2" @click="type = 2 " :variant="variant(2)">Ручная настройка</b-button>
            <b-button @click="save" :disabled="task && task.timeLimit === timeLimit || task.timeLimit === 0 && type === 1" variant="success">Сохранить</b-button>
        </b-button-group>
        <div v-if="type === 2">
            <b-input type="number" v-model="timeLimit" :min="maxTime" :max="10000" trim number></b-input>
            <b-form-text id="input-live-help">Минимальное время - {{maxTime}}</b-form-text>
            <b-form-text id="input-live-help">Максимальное время - 10000</b-form-text>
        </div>
    </div>
</template>

<script>
    export default {
        name: "taskTime",
        props:["task"],

        data(){
            return {
                type: 0,
                timeLimit: null
            }
        },

        computed:{
            attemps(){
                if (this.task){
                    return this.$store.getters["teacher/programming/attemp/attempsResolve"](this.task._id)
                }
                return []
            },
            solvedAttemp(){
                return this.attemps.find(e => e._id === this.task.solvedAttemp)
            },
            maxTime(){
                if (this.solvedAttemp) return Number.parseInt(Math.min.apply(null, this.solvedAttemp.time))
            }
        },

        watch:{
            timeLimit: function (val){
                if (val < this.maxTime) this.timeLimit = null;
                if (val > 10000) this.timeLimit = 10000;
            },
            type: async function (val) {
                if (val === 2) {
                    await this.loadAttemps();
                    if (!this.timeLimit) this.timeLimit = this.maxTime;
                } else if (val === 1){
                    this.timeLimit = 0
                }
            }
        },

        mounted(){
            if (this.task && this.task.timeLimit) this.timeLimit = this.task.timeLimit;
            this.setDefaultType();
        },

        methods:{
            variant(number){
                if (this.type && this.type === number) return 'success';
                return ''
            },
            setDefaultType(){
                if (this.timeLimit) this.type = 2;
                else this.type = 1
            },
            async loadAttemps() {
                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/attemp/loadResolveAttemps", {
                    taskId: this.task._id,
                });
                if (error && errorMessage){
                    this.$notify.error({
                        title: 'Произошла ошибка',
                        message: errorMessage
                    })
                }
            },
            save(){
                const {type, timeLimit} = this;
                if (type === 1 ) {
                    this.$emit('save-task-time',{type, timeLimit:0})
                } else if (type === 2 && timeLimit && timeLimit >= this.maxTime && timeLimit <= 10000) {
                    this.$emit('save-task-time',{type, timeLimit})
                } else {
                    this.$notify.error({
                        title: 'Ошибка при сохранении',
                        message: 'Временные ограничения заданы неверно'
                    })
                }
            }

        }
    }
</script>

<style scoped>

</style>