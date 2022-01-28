<template>
    <div>
      <div v-if="useranswer===rightanswer" class="rightTest"><span v-html="index">.  </span>  Ответ правильный.    Ваш ответ: <span v-html="useranswer"></span></div>
      <div v-else-if="!useranswer" class="unansweredTest"><span v-html="index">.  </span>  Ответ на тест не получен.    Правильный ответ: <span v-html="rightanswer"></span></div>
      <div v-else class="wrongAnswer"><span v-html="index">.  </span>  Ответ неправильный.    Ваш ответ: <span v-html="useranswer"></span>   Правильный ответ: <span v-html="rightanswer"></span></div>
    </div>
</template>

<script>
    export default {
        name: "TestReport",
        props:['index','useranswer','rightanswer'],
    }
</script>

<style scoped>
.rightTest{
  background-color: #28a745;
}
.unansweredTest{
  background-color: gray;
}
.wrongAnswer{
  background-color: red;
}
</style>
