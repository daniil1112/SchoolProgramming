<template>
    <mdb-container>
        <mdb-container v-if="task">
            {{task}}
            <mdb-input
                    label="Заголовок"
                    icon="pen"
                    type="text"
                    class="mb-5"
                    required
                    v-model="title"
                    :isValid="validate.title === 1"
                    :customValidation="validate.title > 0"
                    :invalidFeedback="invalidFeedbackTitle"
                    @change="validateTitle"
                    trim
            />

        </mdb-container>
    </mdb-container>
</template>

<script>
    export default {
        name: "updateTests",

        props:['task'],

        data(){
            return{
                title: this.task.title,
                validate:{
                    title: 0
                },
                start: ''
            }
        },

        computed:{
            invalidFeedbackTitle() {
                if (this.validate.title === 2) return "Введите название задачи"
                else if (this.validate.title === 3)
                    return "Название задачи слишком короткое"
                else if (this.validate.title === 4)
                    return "Название задачи слишком длинное"
            },
        },

        methods: {
            validateTitle() {
                this.title = this.title.trim()
                if (this.title.length === 0) return (this.validate.title = 2)
                else if (this.title.length < 3) return (this.validate.title = 3)
                else if (this.title.length > 70) return (this.validate.title = 4)
                else return (this.validate.title = 1)
            },
        }
    }
</script>

<style scoped></style>
