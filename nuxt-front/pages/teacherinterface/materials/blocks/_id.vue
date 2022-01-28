<template>
  <div>
    <div v-if="logs">
      <div v-for="(log,index) in logs">
        <div  class="success-log" v-if="log>0"> Удачный тест </div>
        <div class="error-log" v-else>Неудачный тест</div>
      </div>
    </div>
    <div v-if="(!report) && testes">
      <div v-for="(test,index) in testes">
       <Test v-bind:title="test.title"
             v-bind:text="test.text"
             v-bind:index="index"
              v-bind:answers="test.answers"
              @addAnswer="addAnswer"
              @unsetAnswer="unsetAnswer"
        />
      </div>
      <button @click="save">Отправить ответы</button>
    </div>
    <div v-if="report">
      <div v-for="index in report.userAnswers.length">
        <TestReport
          v-bind:index="index"
          v-bind:useranswer="report.userAnswers[index-1]"
          v-bind:rightanswer="report.rightAnswers[index-1]"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Test from "@/components/Test";
  import TestReport from "@/components/TestReport";

  export default {
    components:{Test,TestReport},
    name: "id",
    mounted: async function () {
      await this.$store.dispatch('groupTests/loadReport',this.$route.params.id);
      if (!this.report) await this.$store.dispatch('groupTests/loadTests',this.$route.params.id);
      else await this.$store.dispatch('groupTests/cleanTestes',this.$route.params.id);
    },
    computed:{
      testes()
      {
        return this.$store.getters['groupTests/tests']
      },
      report(){
        return this.$store.getters['groupTests/report']
      }
    },

    methods:{
      addAnswer(data)
      {
        this.answers[data.index] = data.answer;
      },
      unsetAnswer(data)
      {
        this.answers[data.index] = -1;
      },
      async save() {
        for (var i = 0; i < this.testes.length; i++) {
          if (this.answers[i] === undefined) this.answers[i] = -1
        }

        const res = await this.$axios.post('http://localhost:4000/setReportTestsInGroup',{
          answers:this.answers,
          id:this.$route.params.id
        });


        if (res.data.report) {
          await this.$store.dispatch('groupTests/loadReport',this.$route.params.id);

        }
      }
    },
    data:function () {
      return{
        answers: [],
        logs: []
      }
    }
  }
</script>

<style scoped>
  .test-title{
    font-weight: bold;
    font-size: 26px;
    align-content: center;
    text-align: center;
  }
  .answers{
    align-content: center;
    text-align: center;
  }
  .test-text{
    align-content: center;
    text-align: center;
  }
  .save-answer{
    align-content: center;
    text-align: center;

    margin-left: 45%;
  }
  .answer-active{
    background-color: aliceblue;
    border: 1px solid greenyellow;
    border-radius: 5px;
  }
  .answer{
    border: 1px solid black;
    border-radius: 5px;
  }
  .answer:hover , .answer-active:hover
  {
    cursor: pointer;
  }
  .success-log{
    background-color: #28a745;
  }
  .error-log{
    background-color: red;
  }
</style>
