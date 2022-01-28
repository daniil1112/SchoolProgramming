<template>
    <div>
        <div v-if="task">
            <mdb-stepper
                    buttons
                    simpleH
                    :steps="steps"
                    @submit="$router.push(`/teacherinterface/materials/programming/${task._id}/view`)"
                    :options="options"
                    validation
                    :validatedSteps="validatedSteps"
                    @validate="setStep"
            >
                <template #1>
                    <TaskType :task="task"
                              @set-task-type="setTaskType"
                              ref="type"
                    />
                </template>
                <template #2>
                    <TaskLangs :task="task"
                               @set-langs="setTaskLangs"
                               ref="languages"
                    />
                </template>
                <template #3>
                    <TaskTime :task="task"
                              @save-task-time="setTaskTime"
                              @next-step="$router.push(`/teacherinterface/materials/programming/${task._id}/view`)"
                    />
                </template>
            </mdb-stepper>
        </div>
        <div v-else>
            <div class="ph-item">
                <div class="ph-col-12">
                    <div class="ph-picture"></div>
                    <div class="ph-picture"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TaskType from "../../../../../components/teacher/programming/finalStage/taskType";
    import TaskLangs from "../../../../../components/teacher/programming/finalStage/taskLangs";
    import TaskTime from "../../../../../components/teacher/programming/finalStage/taskTime";
    export default {
        name: "settings",
        components: {TaskTime, TaskLangs, TaskType},
        layout: "teacher",
        middleware: "authTeacher",
        validate({ params }) {
            return /^\d+$/.test(params.task)
        },

        data() {
            return {
                steps: [
                    { icon: "hammer", far: true, name: "Тип задания" },
                    { icon: "language", name: "Языки " },
                    { icon: "clock", name: "Ограничения времени" },
                ],
                validatedSteps: {},
                options: {
                    stepBtn: {color: "info", active: "amber", iconClass: "white-text"},
                    nextBtn: {outline: "info", icon: "chevron-right", text: 'К следующему шагу'},
                    prevBtn: {outline: "info", icon: "chevron-left", text: 'К предыдущему шагу'},
                    submitBtn: {color: "amber", icon: "check", text: 'К просмотру задания'},
                    lineColor: "amber"
                },
            }
        },

        computed: {
            task() {
                return this.$store.getters["teacher/programming/task/task"](this.$route.params.task)
            },
        },

        async mounted() {
            await this.loadTask();
            await this.setStep();
        },

        methods:{
            async loadTask(force = false){
                await this.$store.dispatch("teacher/programming/task/loadTask", {
                    taskId: this.$route.params.task, force
                })
            },

            async setTaskType(data){
                let {type,check,solvedProgram} = data;
                let template = [];
                if (type === 2){
                    if (!check.some( e => e === true)) return this.$notify.error({
                        title: 'Ошибка при настройке',
                        message: 'Шаблон не может быть полностью решенной программой'
                    });
                    solvedProgram.split('\n').map( (e,i)  => {
                        if (!check[i-1] && check[i]) return template.push(null);
                        else if (check[i-1] && check[i]) return ;
                        return template.push(e)
                    }).join('\n').replace('\n\n','\n');
                }
                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/setTaskType", {
                    taskId: this.task._id,
                    type: data.type,
                    template,
                });

                if (error && errorMessage) {

                    return this.$notify.error({
                        title: 'Ошибка настройке',
                        message: errorMessage
                    });
                }
                else {
                    await this.loadTask(true);
                    return this.$notify.success({
                        title: 'Успех',
                        message: 'Тип задания изменен успешно'
                    });
                }
            },
            async setTaskLangs(data){
                const {languages} = data;
                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/setLangs", {languages, taskId: this.task._id});
                if (error && errorMessage){
                    this.$refs.languages.loadingButton = false;
                    return this.$notify.error({
                        title: 'Ошибка настройки',
                        message: errorMessage
                    });
                }
                else {
                    await this.loadTask(true);
                    this.$refs.languages.loadingButton = false;
                    return this.$notify.success({
                        title: 'Успех',
                        message: 'Языки изменены успешно'
                    });
                }
            },
            async setTaskTime(data){
                const {type, timeLimit} = data;
                const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/setTimelimit", {type, timeLimit, taskId: this.task._id});
                if (error && errorMessage) return this.$notify.error({
                    title: 'Ошибка настройки',
                    message: errorMessage
                });
                else {
                    await this.loadTask(true);
                    return this.$notify.success({
                        title: 'Успех',
                        message: 'Языки изменены успешно'
                    });
                }
            },
            setStep(){
                if (this.task) {
                    if (this.task.type) {
                        this.validatedSteps[1] = true
                        this.step = 2;
                    }
                    if (this.task.langs && this.task.langs.length > 0) {
                        this.validatedSteps[1] = true
                        this.validatedSteps[2] = true
                        this.step = 3
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>