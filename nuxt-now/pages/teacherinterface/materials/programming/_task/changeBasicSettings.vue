<template>
    <el-card>
        <div slot="header" class="clearFix">
            <md-steppers :md-active-step.sync="step" md-linear  >
                <md-step id="first" md-label="Заголовок и задание" :md-editable="false" :md-done="true" />
                <md-step id="second" md-label="Примеры ввода/вывода" :md-editable="false" :md-done="true" />
            </md-steppers>
        </div>
        <ChangeTitleAndTask
                v-if="step === 1 && task"
                :programmingTask="task"
                @save="uptadeTitleAndTask"
                @next-stage="step = 2"
        />
        <ChangeExamples
                v-if="step === 2 && task"
                :programmingTask="task"
                @save = "updateExamples"
                @back="step = 1"
                @to-task-view="$router.push(`/teacherinterface/materials/programming/${task._id}/view`)"
        />
    </el-card>
</template>

<script>
    import ChangeTitleAndTask from "@/components/teacher/programming/firstStage/ChangeTitleAndTask"
    import ChangeExamples from "@/components/teacher/programming/firstStage/ChangeExamples"
    export default {
        name: "changeBasicSettings",
        layout: "teacher",
        middleware: "authTeacher",
        components: { ChangeExamples, ChangeTitleAndTask },
        validate({ params }) {
            return /^\d+$/.test(params.task)
        },
        data() {
            return {
                step: 1,
                secondStep: {
                    examples: [],
                },
            }
        },

        computed: {
            task() {
                return this.$store.getters["teacher/programming/task/task"](this.$route.params.task)
            },
        },

        async mounted() {
            await this.loadTask()
        },

        methods: {
            async loadTask(force = false){
                await this.$store.dispatch("teacher/programming/task/loadTask", {
                    taskId: this.$route.params.task, force
                })
            },
            async uptadeTitleAndTask(data) {
                const {title, task} = data;

                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/updateTitleAndTask", {taskId: this.task._id, title, task});

                if (error && errorMessage) return this.$notify.error({
                    title: 'Ошибка при изменении',
                    message: errorMessage
                });
                else {
                    await this.loadTask(true);
                    return this.$notify.success({
                        title: 'Успех',
                        message: 'Заголовок и текст задания успешно изменеы'
                    });
                }
            },
            async updateExamples(data) {
                const {examples} = data;

                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/updateExamples", {taskId: this.task._id, examples});

                if (error && errorMessage) return this.$notify.error({
                    title: 'Ошибка при изменении',
                    message: errorMessage
                });
                else {
                    await this.loadTask(true);
                    return this.$notify.success({
                        title: 'Успех',
                        message: 'Заголовок и текст задания успешно изменеы'
                    });
                }
            },
            async saveFirstStage(data) {
                this.secondStep = { examples: data.examples }
                const { id, code } = (
                    await this.$axios.post("api/teacher/programming/newTask", {
                        title: this.firstStep.title,
                        task: this.firstStep.task,
                        examples: this.secondStep.examples,
                    })
                ).data;

                if (code) {
                    switch (code) {
                        case 1:
                            this.$notify.error({
                                title: "Ошибка при создании",
                                message: "Ошибка в заголовке или задании!",
                            })
                            this.step = 1
                            break
                        case 2:
                            this.$notify.error({
                                title: "Ошибка при создании",
                                message: "Ошибка в примерах ввода\\вывода!",
                            })
                            this.step = 2
                            break
                        default:
                            break
                    }
                } else if (id) {
                    this.$notify.success({
                        title: "Успех",
                        message: "Задание создано!",
                    })
                    this.$router.push(`/teacherinterface/materials/programming/${id}/view`)
                }
            },
        },
    }
</script>

<style scoped>
    .clearFix:before,
    .clearFix:after {
        display: table;
        content: "";
    }
    .clearFix:after {
        clear: both;
    }
    .md-stepper{
        display: none;
    }
</style>
