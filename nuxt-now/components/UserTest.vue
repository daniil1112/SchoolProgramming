<template>
  <div>
    <div v-if="tests">
      {{ options }}
      <div v-if="showReport">
        <div v-if="report && !report.empty">
          Задание решено на {{ report.points }}
          <v-expansion-panels :accordion="true">
            <v-expansion-panel
              v-for="(test,index) in tests" :key="index"
>
              <v-expansion-panel-header>
Тест {{ index+1 }}
                <v-spacer></v-spacer>
                <v-icon v-if="report && report.answers && ((test.type ===1 || (test.type ===3) )&& report.answers[index] === test.rightAnswer) || (test.type ===2 && JSON.stringify(report.answers[index]) === JSON.stringify(test.rightAnswer))">
el-icon-circle-check
</v-icon>
              
                <v-icon v-else>
el-icon-circle-close
</v-icon>
              </v-expansion-panel-header>
              <v-expansion-panel-content v-if="report && report.answers">
                <single-answer-report v-if="test.type ===1" :test="test" :answer="report.answers[index]" />
                <multy-test-report v-else-if="test.type ===2" :test="test" :answer="report.answers[index]" />
                <open-answer-report v-else-if="test.type ===3" :test="test" :answer="report.answers[index]" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div v-else>
          Решения задания получено не было, за задание поставлено 0 баллов
        </div>
</div>
      <div v-else>
        <div v-for="(test,index) in tests">
            <div v-if="report && report.answers">
            <SingleTestStudent
              v-if="test.type === 1"
              :index="index+1"
              :test="test"
              :answers="report.answers[index]"
              @update-answer="updateAnswers"
            />
            <MultyTestStudent
              v-if="test.type === 2"
              :index="index+1"
              :answers="report.answers[index]"
              :test="test"
              @update-answer="updateAnswers"
            />
            <OpenAnswerTest
              v-if="test.type === 3"
              :index="index+1"
              :answers="report.answers[index]"
              :test="test"
              @update-answer="updateAnswers"
            />
          </div>
          <div v-else>
            <SingleTestStudent
              v-if="test.type === 1"
              :index="index+1"
              :test="test"
              :answers="null"
              @update-answer="updateAnswers"
            />
            <MultyTestStudent
              v-if="test.type === 2"
              :index="index+1"
              :test="test"
              :answers="null"
              @update-answer="updateAnswers"
            />
            <OpenAnswerTest
              v-if="test.type === 3"
              :index="index+1"
              :test="test"
              :answers="null"
              @update-answer="updateAnswers"
            />
          </div>
        </div>
        <el-button @click="updateReport">
Сохранить ответы
</el-button>
        <el-button @click="earlyClose">
Завершить выполнение
</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import SingleTestStudent from "@/components/tests/SingleTestStudent"
import MultyTestStudent from "@/components/tests/MultyAnswerStudent"
import OpenAnswerTest from "@/components/tests/OpenAnswerStudent"
import MultyTestReport from "./tests/MultyTestReport"
import OpenAnswerReport from "./tests/OpenAnswerReport"
import SingleAnswerReport from "./tests/SingleAnswerReport"
export default {
  name: "UserTest",
        components: {
            SingleAnswerReport,
            OpenAnswerReport,
            MultyTestReport, OpenAnswerTest, MultyTestStudent, SingleTestStudent},
        props:['id','options'],
  async mounted() {
    await this.$store.dispatch("student/task/loadAllTasks")
    await this.$store.dispatch("student/report/loadReport", {
      taskId: this.$route.params.task,
    })
    await this.$store.dispatch("student/tests/loadTests", { taskId: this.id })
    if (this.report && this.report.answers) this.answers = this.report.answers
    this.refreshTimeAndReport()
    this.setIntervalUpdateDate()
  },

  data() {
    return {
      answers: [],
      timeout: null,
      now: new Date(),
    }
  },
  computed: {
    ended(){
      return this.now > new Date(this.options.stopTime)
    },
    showReport() {
      return (
        (!this.options.options.checkDelay && !this.report.empty) ||
        this.ended ||
        (!this.report.empty && this.report.earlyClose)
      )
    },
    report() {
      return this.$store.getters["student/report/report"](this.options._id)
    },
    tests() {
      let tests = this.$store.getters["student/tests/tests"](this.options._id)

      if (tests && tests.tests) {
        return tests.tests
      }
    },
  },
        beforeDestroy() {
            if (this.timeout){
                clearTimeout(this.timeout)
            }
        },


        methods:{
          setIntervalUpdateDate(){
            if (!this.dateInterval) this.dateInterval = setInterval(() => {
              this.now = null
              this.now = new Date()
            }, 2000)
          },
            updateAnswers(data){
                this.answers[(data.index - 1)] = data.answer
            },
            refreshTimeAndReport(){
                let time;
                time = parseInt(new Date(new Date().toISOString()).getTime()/1000);
                console.log(time);
                if (time > this.options.stopTime && (!this.report || this.report.empty)){
                    console.log('stop Task');
                    this.$store.dispatch('student/report/reloadReport',{
                        taskId:this.id,
                    });
                    if (this.timeout) clearTimeout(this.timeout);
                    return
                } else if (time > this.options.stopTime) {
                    if (this.timeout) clearTimeout(this.timeout);
                    return;
                }
                this.timeout = setTimeout(this.refreshTimeAndReport,5000);
            },
            async updateReport(){
                const tests = await this.$store.dispatch('student/report/createReport',{
                    taskId:this.id,
                    answers: this.answers
                });
                if (tests.data.report){

                    let message;

                    if (!this.showReport){
                        message = 'Вы можете менять ответы'
                    } else {
                        message = `Задание решено на ${tests.data.report.points} баллов`
                    }
                    this.$notify.success({
                        title: 'Ответы сохранены',
                        message: message
                    })
                }
            },
            async earlyClose(){
                await this.$store.dispatch('student/report/createReport',{
                    taskId:this.id,
                    answers: this.answers
                });
                const result  = await this.$store.dispatch('student/report/closeTestsTask',{
                    taskId:this.id,
                });
                if (result.data.success){
                    await this.$store.dispatch('student/report/reloadReport',{
                        taskId:this.id,
                    })

                }
            }
        }
}
</script>

<style scoped></style>
