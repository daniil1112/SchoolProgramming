<template>
  <div id="form">
    <input type="text" v-model="title" placeholder="Заголовок теста">
    <input type="text" v-model="text" placeholder="Задание">
    <div v-for="item in items">
      <input v-model="item.value">
      <button @click="setanswer(item)">Сделать вариант правильным</button>
    </div>

    <button @click="addItem">add</button> {{items}}
    <p><button @click="save">Сохранить тест</button></p>

    {{answer}}
  </div>
</template>

<script>
  export default {
    name: "test",
    data:function () {
      return{
        title:null,
        text:null,
        items: [],
        index:0,
        answer:null
      }
    },

    methods:{
      addItem(){
        this.items.push({value : '',index:this.index});
        this.index++;
      },
      save(){
        const data = {
          title: this.title,
          text: this.text,
          answers: this.items,
          answer: this.answer
        };

        const res = this.$axios.$post("http://localhost:4000/newtest",data);
        console.log(res)
      },
      setanswer(item){
        this.answer = item.index;
      }
    }
  }
</script>

<style scoped>

</style>
