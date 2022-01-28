<template>
    <div>
        <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
                <i class="el-icon-edit" />
            </b-input-group-prepend>
            <b-form-input
                    v-model="title"
                    type="text"
                    :state="validationTitleState"
                    placeholder="Заголовок"
                    trim
                    @blur="validateTitle"
            />
            <b-form-invalid-feedback :state="validationTitleState">
                {{ invalidFeedbackTitle }}!
            </b-form-invalid-feedback>
        </b-input-group>
        <b-form-text v-if="validationTitleState || validationTitleState === null">
            Заголовок должен быть от 3 до 70 символов
        </b-form-text>
        <b-input-group class="mb-2">
            <b-input-group-prepend is-text>
                <i class="el-icon-edit" />
            </b-input-group-prepend>
            <b-form-input
                    v-model="task"
                    type="text"
                    :state="validationTaskState"
                    placeholder="Задание"
                    trim
                    @blur="validateTask"
            />
            <b-form-invalid-feedback :state="validationTaskState">
                {{ invalidFeedbackTask }}!
            </b-form-invalid-feedback>
        </b-input-group>
        <b-form-text v-if="validationTaskState || validationTaskState === null">
            Текст задания должен быть от 10 до 500 символов
        </b-form-text>
        <b-button variant="success" @click="save" :disabled="title === programmingTask.title && task === programmingTask.task ">Сохранить</b-button>
        <b-button variant="primary" @click="$emit('next-stage')">
            К следующему шагу
        </b-button>

        <!--        Можно будет даже тему впихнуть-->
    </div>
</template>

<script>
    export default {
        name: "ChangeTitleAndTask",
        props: ["programmingTask"],
        data() {
            return {
                title: "",
                task: "",
                validate: {
                    title: 0,
                    task: 0,
                },
            }
        },

        computed: {
            validationTitleState() {
                if (this.validate.title === 0) return null
                else if (this.validate.title === 1) return true
                return false
            },
            validationTaskState() {
                if (this.validate.task === 0) return null
                else if (this.validate.task === 1) return true
                return false
            },
            invalidFeedbackTitle() {
                if (this.validate.title === 2) return "Введите название задачи"
                else if (this.validate.title === 3)
                    return "Название задачи слишком короткое"
                else if (this.validate.title === 4)
                    return "Название задачи слишком длинное"
            },
            invalidFeedbackTask() {
                if (this.validate.task === 2) return "Введите текст задачи"
                else if (this.validate.task === 3) return "Текст задачи слишком короткое"
                else if (this.validate.task === 4) return "Текст задачи слишком длинное"
            },
        },

        mounted() {
            const { title, task } = this.programmingTask;
            this.title = title;
            this.task = task;
            this.validateTitle();
            this.validateTask();
        },

        methods: {
            validateTitle() {
                if (this.title.length === 0) return (this.validate.title = 2)
                if (this.title.length < 3) return (this.validate.title = 3)
                if (this.title.length > 70) return (this.validate.title = 4)
                return (this.validate.title = 1)
            },
            validateTask() {
                if (this.task.length === 0) return (this.validate.task = 2)
                if (this.task.length < 10) return (this.validate.task = 3)
                if (this.task.length > 500) return (this.validate.task = 4)
                return (this.validate.task = 1)
            },
            save() {
                const {title, task} = this;
                this.validateTitle();
                this.validateTask();
                if (!(this.validationTitleState && this.validationTaskState))
                    return this.$notify.error({
                        title: "Ошибка данных",
                        message: "Проверьте введенные данные",
                    });

                this.$emit("save", { title, task })
            },
        },
    }
</script>

<style scoped></style>
