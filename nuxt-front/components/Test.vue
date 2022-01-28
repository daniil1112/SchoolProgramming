<template>
  <div>
    <div class="test-title" v-html="title"></div>
    <div class="test-text" v-html="text"></div>
    <div class="answers">
      <div v-for="(item,indexAnswer) in answers" >
        <div v-if="indexAnswer !== answer" class="answer" @click="addAnswer(indexAnswer)">Вариант {{indexAnswer+1}} --- Вариант ответа - {{item.value}}</div>
        <div v-else class="answer-active" @click="unsetanswer"> Вариант {{indexAnswer+1}} --- Вариант ответа - {{item.value}} </div>
      </div>
    </div>

  </div>
</template>

<script>
    export default {
        name: "Test",
        props:['title','text','answers','index'],
        methods:{
          addAnswer(index){
            this.answer = index;
            this.$emit('addAnswer',{
              index:this.index,
              answer:this.answer
            })
          },
          unsetanswer()
          {
            this.answer = null;
            this.$emit('unsetAnswer',{
              index:this.index,
            })
          }
        },
        data:function () {
          return{
            answer: null,
          }
        },

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
    ackground-color: aliceblue;
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
</style>
