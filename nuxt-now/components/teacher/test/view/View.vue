<template>
  <div v-if="test">
    <el-card>
      <div slot="header" class="clearfix">
        <el-button class="card-header-button" type="text" @click="updateTest">
          Редактировать
        </el-button>
      </div>
      <b>Задание номер 1</b>
      <p>Выберите правильный(е) ответ(ы)</p>
      <h4>{{ test.title }}</h4>
      <p>{{ test.task }}</p>
      <SingleAnswer
        v-if="test.type === 1"
        :answer-choice="test.answerChoice"
        :right-answer="test.rightAnswer"
      />
      <MultiAnswer
        v-else-if="test.type === 2"
        :answer-choice="test.answerChoice"
        :right-answer="test.rightAnswer"
      />
      <OpenAnswer
        v-else-if="test.type === 3"
        :right-answer="test.rightAnswer"
      />
      <b-button variant="success" :disabled="true">
        Ответить
      </b-button>
    </el-card>
  </div>
</template>

<script>
import OpenAnswer from "@/components/teacher/test/view/OpenAnswer"
import SingleAnswer from "@/components/teacher/test/view/SingleAnswer"
import MultiAnswer from "@/components/teacher/test/view/MultiAnswer"
export default {
  name: "View",
  components: { MultiAnswer, SingleAnswer, OpenAnswer },
  props: ["test"],

  methods: {
    updateTest() {
      this.$router.push(
        `/teacherinterface/materials/tests/${this.test._id}/update`
      )
    },
  },
}
</script>

<style scoped>
.card-header-button {
  float: right;
  padding: 3px 0;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
