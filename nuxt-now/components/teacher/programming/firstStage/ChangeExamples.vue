<template>
    <div>

        <b-button v-b-modal.modal-1>
            Добавить пример
        </b-button>
        <b-button variant="success" :disabled="examples.length === 0 || JSON.stringify(examples) === JSON.stringify(programmingTask.samples)" @click="save">
            Сохранить
        </b-button>
        <b-button variant="danger" @click="$emit('back')">
            К предыдущему шагу
        </b-button>
        <b-button variant="primary" @click="$emit('to-task-view')">
            К просмотру задания
        </b-button>
        <b-modal id="modal-1" size="xl" centered>
            <b-row>
                <b-col sm="6">
                    <b-form-textarea
                            id="textarea-default"
                            v-model="currentInput"
                            class="font-size-12"
                            placeholder="Ввод"
                            trim
                    />
                </b-col>
                <b-col sm="6">
                    <b-form-textarea
                            id="textarea-default"
                            v-model="currentOutput"
                            class="font-size-12"
                            placeholder="Вывод"
                            trim
                    />
                </b-col>
            </b-row>
            <template v-slot:modal-footer>
                <div class="w-100">
                    <b-button variant="success" @click="addExample">
                        Добавить пример
                    </b-button>
                </div>
            </template>
        </b-modal>

        <b-row class="mt-2">
            <b-col sm="6">
                <label>Пример ввода:</label>
            </b-col>
            <b-col sm="6">
                <label>Пример вывода:</label>
            </b-col>
            <b-col v-for="example in examples" sm="12">
                <b-row>
                    <b-col sm="6">
                        <b-form-textarea
                                id="textarea-default"
                                v-model="example.input"
                                class="font-size-12"
                                placeholder="Default textarea"
                                :readonly="true"
                        />
                    </b-col>
                    <b-col sm="6">
                        <b-form-textarea
                                id="textarea-default"
                                v-model="example.output"
                                class="font-size-12"
                                placeholder="Default textarea"
                                :readonly="true"
                        />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "Examples",

        props:['programmingTask'],

        data() {
            return {
                currentInput: "",
                currentOutput: "",
                examples: [],
            }
        },

        mounted(){
            this.examples = Object.assign([],this.programmingTask.samples);
        },

        methods: {
            addExample() {
                const { examples, currentInput, currentOutput } = this;
                if (currentInput.length === 0)
                    return this.$notify.error({
                        title: "Ошибка",
                        message: "Ввод не может быть пустым",
                    });
                if (currentOutput.length === 0)
                    return this.$notify.error({
                        title: "Ошибка",
                        message: "Вывод не может быть пустым",
                    });
                if (examples.some((e) => e.input === currentInput))
                    return this.$notify.error({
                        title: "Ошибка",
                        message: "Дублирующийся ввод",
                    });
                this.examples.push({
                    input: this.currentInput,
                    output: this.currentOutput,
                });
                this.currentInput = "";
                this.currentOutput = "";
            },
            save() {
                const {examples} = this;
                if (examples.length === 0)
                    return this.$notify.error({
                        title: "Ошибка",
                        message: "Введите хотя-бы один пример",
                    });
                this.$emit("save", { examples })
            },
        },
    }
</script>

<style scoped>
    .font-size-12 {
        font-size: 12px;
    }
</style>
