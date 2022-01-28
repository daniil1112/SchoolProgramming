<template>
  <div>
<div><h1>{{task.title}}</h1></div>
  <div><h4>{{task.task}}</h4></div>
    <div>
      <textarea
      v-model="answer"
      placeholder="Программа"
      class="program-textarea"
      ref="textarea"
      @change="textareaResize"
    ></textarea></div>
    <button @click="check">Проверить</button>
  </div>
</template>

<script>
    export default {
        name: "id",
        mounted: async function(){
          await this.$store.dispatch('programs/loadProgramTask',this.$route.params.id);
        },
      computed:{
          task(){
            return this.$store.getters['programs/programTask'];
          }
        },
      data:function () {
        return{
          answer:null,
        }
      },
      methods:{
        textareaResize(){
            this.$refs.textarea.style.minHeight = this.$refs.textarea.scrollHeight + 'px';
        },
        async check(){
          const res = await this.$axios.post('http://localhost:4041/checkProgram',{
            program:this.answer,
            _id:this.$route.params.id
          })
          console.log(res)
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
</style>
