<template>
    <div>
        <div class="program-input">
            <div v-for="(element, index) in input">
                <b-input-group>
                    <b-input
                            v-model="input[index]"
                            placeholder="Входные параметры"
                            @change="validateOne(index)"
                            @blur="validateOne(index)"
                            :state="validationInputState(index)"
                            trim
                    />
                    <b-input-group-append>
                        <b-button variant="danger" @click="deleteInput(index)"><b-icon-trash/></b-button>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
        <b-button-group>
            <b-button variant="primary" @click="addInput">Добавить тест</b-button>
            <b-button variant="danger" @click="input = []">Очистить тесты</b-button>
            <b-button variant="success" @click="pushInput" :disabled="taskInput && JSON.stringify(taskInput) === JSON.stringify(input) || input.length === 0">Сохранить изменения</b-button>
        </b-button-group>
    </div>
</template>

<script>
    export default {
        name: "ManualInput",

        props:['taskInput','compiling'],

        data(){
            return {
                input: [],
                validate: [],
            }
        },

        mounted() {
            this.setDefaultInput();
            this.validateAll()
        },


        methods:{
            addInput() {
                this.input.push("");
                this.validate.push(0)
            },
            deleteInput(index) {
                this.input.splice(index, 1)
            },
            validateOne(index){
                if (this.input[index].length === 0) this.validate[index] = 2;
                else this.validate[index] = 1;
                // Для сохранения реактивности!!!
                this.validate = Object.assign([],this.validate);
            },
            validateAll(){
                let validate = this.validate;
                this.input.forEach( function (element, i) {
                    if (element.length === 0) return validate[i] = 2;
                    validate[i] = 1
                })
            },
            setDefaultInput(){
                if (this.taskInput) this.input = Object.assign([],this.taskInput)
            },
            pushInput() {
                let input = this.input;
                this.validateAll();
                if (this.validate.some(e => e===2 || e === 0)) return this.$notify.error({
                    title: 'Ошибка',
                    message: 'Проверьте введенные данные'
                });
                this.$emit('add-input',{input})
            },

            validationInputState(index){
                if (typeof this.validate[index] === "number" && this.validate[index] === 0 ) return null;
                else if (typeof this.validate[index] === "number" && this.validate[index] === 1 ) return true;
                return false
            },
        }

    }
</script>

<style scoped>

</style>