<template>
    <mdb-container>
        <h1>Выберите разрешенные языки для решения задачи:</h1>
        <mdb-container v-show="!loadingPage">
            <mdb-select
                    ref="select"
                    multiple
                    selectAll
                    :disabled="task.type === 2"
                    v-model="languagesModel"
                    @change="setDefaultLang(false)"
                    label="Example label"
                    placeholder="choose your option"
            />
            <mdb-btn
                    :disabled="JSON.stringify(task.langs) === JSON.stringify(value) || loadingButton"
                    @click="setAcceptedLanguages">
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" v-show="loadingButton"></span>
                Сохранить
            </mdb-btn>
        </mdb-container>
        <mdb-container v-show="loadingPage">
            <div class="ph-item">
                <div class="ph-col-12">
                    <div class="ph-picture"></div>
                </div>
            </div>
        </mdb-container>
    </mdb-container>
</template>

<script>
    export default {
        name: "taskLangs",

        props:['task'],


        data(){
            return{
                value: [],
                defaultLanguage: null,
                languagesModel: [],
                loadingButton: false,
                loadingPage: true
            }
        },

        watch:{
            languagesModel: function (val) {
                this.value = []
                val.forEach( e => {
                    if (e.selected) this.value.push(e._id)
                });
            }
        },


        computed:{
            languages(){
                return this.$store.getters['teacher/programming/languages/languages']
            }
        },



        async mounted() {
            await this.loadLanguages();
            await this.loadDefaultLang();
            this.setLanguages();
            this.setDefaultLang(true);
            this.loadingPage = false
        },

        methods:{
            setDefaultLang(first = false){
                if (first && this.task.langs){
                    this.value = [...this.task.langs]
                    this.task.langs.forEach( e => {
                        this.languagesModel.forEach( (n,index) =>{
                            if (n._id === e) this.languagesModel[index].selected = true
                        })
                    })

                }
                this.languagesModel.forEach( (e,i) => {
                    if (e._id === this.defaultLanguage) {
                        this.languagesModel[i].selected = true
                    }
                    if (!this.value.some(e => e === this.defaultLanguage)) {
                        this.value.push(this.defaultLanguage)
                        this.$refs.select.update()
                    }
                })
            },
            setLanguages(){
                this.languages.forEach(e =>{
                    this.languagesModel.push({
                        text: e.label,
                        value: e._id,
                        _id: e._id
                    })
                })
            },
            setAcceptedLanguages(){
                let errorMessage = null;
                this.setDefaultLang();
                if (this.value.length === 0) errorMessage = 'Не выбраны языки';
                if (this.task.type === 2 ) errorMessage = 'Для этого задания нельзя выбирать языки';
                if (errorMessage) return this.$notify.error({
                    title: 'Ошибка при настройке',
                    message: errorMessage
                });

                this.loadingButton = true

                this.$emit('set-langs',{languages: this.value})

            },
            async loadLanguages(){
                await this.$store.dispatch('teacher/programming/languages/loadLanguages')
            },
            async loadDefaultLang(){
                let {defaultLanguage} = (await this.$axios.post("/api/teacher/programming/languages/taskDefault",{taskId: this.task._id})).data;
                this.defaultLanguage = defaultLanguage
            }
        }
    }
</script>

<style scoped>
</style>