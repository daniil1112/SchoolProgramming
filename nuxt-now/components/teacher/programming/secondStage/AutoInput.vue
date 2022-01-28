<template>
    <div>
        <div>
            Количество тестов:
            <el-input-number
                    v-model="countTests"
                    :min="1"
                    :max="100"
                    controls-position="right" />
        </div>
        Введите программу (На ввод подается номер теста)
        <input-program v-if="lastAttemp"
                :compiling="compiling"
                :code.sync="lastAttemp.program"
                :lang="lastAttemp.programLang"
                :langs="languages"
                @export-program="compileInputProgram">
            <template v-slot:buttons>
                <b-button variant="info" @click="$emit('to-next-stage')" v-if="taskInput && !compiling && taskInput.length > 0"  >К следующему шагу</b-button>
            </template>
        </input-program>
        <input-program v-else
                :lang="1"
                :compiling="compiling"
                :langs="languages"
                @export-program="compileInputProgram">
        </input-program>
    </div>
</template>


<script>
    import InputProgram from "../../../programming/InputProgram";
    export default {
        name: "AutoInput",
        props:['compiling','taskInput','lastAttemp'],
        components: {InputProgram},


        data(){
            return {
                countTests: 1,
                programLang: 1
            }
        },

        computed:{
            languages(){
                return this.$store.getters['teacher/programming/languages/languages']
            }
        },

        async mounted(){
            await this.loadProgrammingLangs()
        },


        methods:{
            async compileInputProgram(options) {
                let {taskSolved,taskInput} = this;
                let {program,programLang} = options;
                let countTests = this.countTests;

                if (program, programLang, countTests) this.$emit('add-input',{taskSolved,taskInput,program,programLang,countTests});

            },

            async loadProgrammingLangs(){
                await this.$store.dispatch('teacher/programming/languages/loadLanguages')
            },

        }
    }
</script>

<style scoped>

</style>