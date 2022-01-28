<template>
  <div>
    <div>
      <input type="text" v-model="title" placeholder="Название задачи">
    </div>
    <div>
      <input type="text" v-model="task" placeholder="Задача">
    </div>
    <div class="compile-error"><span v-if="errortext" v-html="errortext"></span></div>
            <textarea
              v-model="text"
              placeholder="Программа"
              class="program-textarea"
              ref="textarea"
              @input="textareaResize"
            ></textarea>
    <div>
      <div v-for="(test,id) in tests">
          <textarea
            v-model="tests[id]"
            placeholder="Ввод"
            class="input-textarea"></textarea>
        <textarea
          v-model="output[id]"
          placeholder="Выходные параметры"
          class="input-textarea"
          disabled></textarea>
        <span v-if="compiler[id]==='OK'"><i class="el-icon-check output-icon"></i> <span v-html="time[id]+' мс'"> </span></span>
      </div>
      <button @click="addtest">Добавить тест</button>
    </div>
    <button @click="generate">Сохранить задачу</button>

  </div>
</template>

<script>
  export default {
    name: "programtests",
    data:function(){
      return{
        text:null,
        tests:[],
        output:[],
        compiler:[],
        time:[],
        errortext:null,
        title:null,
        task:null
      }
    },
    mounted() {
      //Автоувеличение размера textarea
      this.$refs.textarea.style.minHeight = this.$refs.textarea.scrollHeight + 'px';
    },
    methods:{
      textareaResize(){
        this.$refs.textarea.style.minHeight = this.$refs.textarea.scrollHeight + 'px';
      },
      addtest(){
        this.tests.push('')
      },
      async generate(){
        this.output=[];
        this.compiler=[];
        this.time=[];
        this.errortext=null;
        const result = await this.$axios.post('http://localhost:4041/programteacher',{
          program:this.text,
          input:this.tests,
          title:this.title,
          task:this.task

        });
        this.output=result.data.output;
        this.compiler=result.data.compiler;
        this.time=null;
        this.time=result.data.time;
        if (result.data.CE) this.errortext=result.data.errortext;
      }
    }
  }
</script>

<style scoped>
  .program-textarea{
    background: #fce9c0; /* Цвет фона */
    border: 2px solid #a9c358; /* Параметры рамки */
    resize: none;
    width: 500px;

  }
  .input-textarea{
    background: antiquewhite; /* Цвет фона */
    border: 2px solid #a9c358; /* Параметры рамки */
    resize: none;
  }
  .output-icon{
    font-size: 30px;
  }
</style>
