<template>
  <el-card>
    <modal-window v-if="visibleModal" @close="visibleModal = false">
      <template v-if="headerModal" v-slot:header><span v-html="headerModal" /> </template>
      <template v-slot:body>
        <b-row class="mt-2" v-if="task && type === 1">
          <b-col sm="6">
            <label>Пример ввода:</label>
          </b-col>
          <b-col sm="6">
            <label>Пример вывода:</label>
          </b-col>
          <b-col  v-for="example in task.samples" sm="12">
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

        <b-col  v-if="type===2 && task.input" v-for="(element,index) in task.input" sm="12">
          <b-row>
            <b-col sm="3">Тест {{index+1}}</b-col>
            <b-col sm="9">
              <b-form-textarea
                      id="textarea-default"
                      :value="element"
                      class="font-size-12"
                      placeholder="Default textarea"
                      :readonly="true"
              />
            </b-col>
          </b-row>
        </b-col>
        <div v-if="type===3 && task.langs">
          <ul>
            <li v-for="lang in task.langs" v-html="languages.find(e => e._id === lang).label"/>
          </ul>
        </div>
        <div v-if="type===4 && task.template">
          <code v-for="template in task.template">
            <p v-if="typeof template==='string'">{{template}}</p>
            <p v-else>Пользовательский код</p>
          </code>
        </div>
      </template>
    </modal-window>
    <div v-if="task">
      <mdb-stepper
              @changeStep="setActiveStep"
              :steps="steps"
              simpleH
              validation
              :validatedSteps="validatedSteps"
              ref="stepper" />
      <p>
        <span>Заголовок: <b>{{ task.title }}</b></span>
      </p>
      <p>
        <span
          >Задание: <b>{{ task.task }}</b></span
        >
      </p>
      <p>
        <span>Примеры: <b v-if="task.samples.length > 0">Указаны  <el-button type="info" icon="el-icon-view" @click="viewSamples" circle /></b>
          <b v-else>Не указаны</b>
        </span>
      </p>
      <p>
        <span>Входные тесты: <b v-if="task.input.length > 0">Указаны  <el-button type="info" icon="el-icon-view" @click="viewTestsInput" circle /></b>
          <b v-else>Не указаны</b>
        </span>
      </p>
      <p>
        <span>Решена: <b v-if="task.solved">Да</b>
          <b v-else>Нет</b>
        </span>
      </p>
      <p>
        <span>Разрешенные языки:
          <div v-if="task.langs.length>0"><b>указаны</b>  <el-button type="info" icon="el-icon-view" @click="viewAcceptedLangs" circle /></div>
          <div v-else>Не указаны</div>
        </span>
      </p>
      <p>
        <span>Временной лимит: <b><span v-if="!task.timeLimit|| task.timeLimit === 0">Автоматический</span><span v-else>{{task.timeLimit}} мс</span> </b>  </span>
      </p>
      <p>
        Тип задания: <b v-if="!task.type">Не указан</b> <b v-if="task.type === 1">Обычное задание</b> <b v-else-if="task.type===2">Задание с шаблоном  <el-button type="info" icon="el-icon-view" @click="viewTemplate" circle /></b>
      </p>
      <p>Готова к использованию: <b v-if="task.ready">Да</b><b v-else>Нет</b></p>
      <div v-if="task.ready"></div>
      <div v-else-if="secondStageReady">
        <button @click="$router.push(`/teacherinterface/materials/programming/${task._id}/changebasicsettings`)" type="button" class="btn btn-outline-primary btn-rounded waves-effect">Изменить Задачу и примеры</button>
        <button @click="$router.push(`/teacherinterface/materials/programming/${task._id}/solve`)" type="button" class="btn btn-outline-primary btn-rounded waves-effect">Изменить решение заданий и входные тесты</button>
        <button v-if="task.type" @click="$router.push(`/teacherinterface/materials/programming/${task._id}/settings`)" type="button" class="btn btn-outline-primary btn-rounded waves-effect">Изменить настройки задания</button>
        <button v-else @click="$router.push(`/teacherinterface/materials/programming/${task._id}/settings`)" type="button" class="btn btn-outline-primary btn-rounded waves-effect">Настроить задание</button>
        <button v-if="task.type" @click="setReady" type="button" class="btn btn-outline-success btn-rounded waves-effect">Сделать доступной для использования</button>
      </div>
      <div v-else-if="firstStageReady">
        <b-button @click="$router.push(`/teacherinterface/materials/programming/${task._id}/changebasicsettings`)">Изменить Задачу и примеры</b-button>
        <b-button @click="$router.push(`/teacherinterface/materials/programming/${task._id}/solve`)">Создать входные тесты</b-button>
      </div>
      <div v-else>
        <b-button @click="$router.push(`/teacherinterface/materials/programming/${task._id}/changebasicsettings`)">Создать задачу и примеры</b-button>
      </div>

      <b-button
        v-if="!(task.input.length > 0 && task.solved)"
        variant="success"
        @click="continueCreate"
      >
        Продолжить создание задачи
      </b-button>
    </div>
  </el-card>
</template>

<script>
import ModalWindow from "../../../../../components/ModalWindow";
export default {
  name: "View",
  components: {ModalWindow},
  layout: "teacher",
  middleware: "authTeacher",

  validate({ params }) {
    return /^\d+$/.test(params.task)
  },

  data() {
    return {
      headerModal: '',
      visibleModal: false,
      type: 0,
      programLang: [],
      steps:[
        {name:'Задание'},
        {name:'Тесты и решение'},
        {name:'Настройки'},
        {name:'Публикация'},
      ],
      validatedSteps:{1: true, 2: true, 3: true, 4: true}
    }
  },

  computed:{
    task() {
      return this.$store.getters["teacher/programming/task/task"](this.$route.params.task)
    },
    firstStageReady(){
      const {task} = this;
      return task && task.title && task.task && task.samples && task.samples.length>0
    },
    secondStageReady(){
      const {firstStageReady, task} = this;
      return firstStageReady && task.input.length > 0 && task.solved
    },
    languages(){
      return this.$store.getters['teacher/programming/languages/languages']
    }
  },

  async mounted() {
    await this.loadLanguages();
    await this.loadTask();
    await this.setActiveStep()
  },

  methods: {
    async loadTask(force = false){
      await this.$store.dispatch("teacher/programming/task/loadTask", {
        taskId: this.$route.params.task, force
      })
    },
    viewSamples(){
      this.visibleModal = true;
      this.headerModal = 'Примеры ввода';
      this.type = 1
    },
    viewTestsInput(){
      this.visibleModal = true;
      this.headerModal = 'Входные тесты';
      this.type = 2
    },
    viewAcceptedLangs(){
      this.visibleModal = true;
      this.headerModal = 'Разрешенные языки програмирования';
      this.type = 3
    },
    viewTemplate(){
      this.visibleModal = true;
      this.headerModal = 'Шаблон задания';
      this.type = 4
    },

    continueCreate() {
      if (!this.task.solved)
        return this.$router.push(
          `/teacherinterface/materials/programming/${this.$route.params.task}/solve`
        )
    },
    async loadLanguages(){
      await this.$store.dispatch('teacher/programming/languages/loadLanguages')
    },
    setActiveStep(){
      let {task} = this
      if (task.title && task.task && task.samples.length > 0) this.$refs.stepper.activeStep =2
      if (task.input.length > 0 && task.solved) this.$refs.stepper.activeStep =3
      if (task.type && task.langs.length>0) this.$refs.stepper.activeStep =4
      if (task.ready) this.$refs.stepper.activeStep =5
    },

    setReady(){
      this.$confirm('При публикации задачи, ничего нельзя будет изменить. Вы уверены, что все верно?').then(async _ =>{
        const {error, errorMessage} = await this.$store.dispatch("teacher/programming/task/setReady", {
          taskId: this.task._id,
        });
        if (error && errorMessage) return this.$notify.error({
          title: 'Ошибка при изменении',
          message: errorMessage
        });
        else {
          this.loadTask(true);
          return this.$notify.success({
            title: 'Успех',
            message: 'Задача готова к использованию'
          });
        }
      })
    }
  },
}
</script>

<style scoped></style>
