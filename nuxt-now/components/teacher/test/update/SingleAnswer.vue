<template>
  <div>
    <el-button @click="(_) => (this.visibleAdd = true)">
      Добавить вариант ответа
    </el-button>
    <el-dialog
      title="Добавление варианта ответа"
      :before-close="(_) => (this.visibleAdd = false)"
      :visible="visibleAdd"
      width="30%"
      center
    >
      <b-input-group>
        <b-form-input
          v-model="current"
          placeholder="Вариант ответа"
          trim
          @keypress.enter.native="addAnswer"
        />
        />
      </b-input-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="addAnswer"
          >Добавить вариант ответа</el-button
        >
        <el-button @click="(_) => (this.visibleAdd = false)">Cancel</el-button>
      </span>
    </el-dialog>
    <b-overlay
      :show="loading"
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block"
    >
      <b-button
        id="save-single-test-button"
        variant="outline-success"
        :disabled="loading || !(answer && tests.length > 1)"
        @click="save"
      >
        Сохранить тест
      </b-button>
    </b-overlay>
    <b-form-text v-if="tests.length > 0 && selectedRow.length === 0">
      Выберите один правильный ответ
    </b-form-text>
    <b-form-text v-if="tests.length === 1 && selectedRow.length === 1">
      Минимальное количество вариантов ответа - 2
    </b-form-text>
    <div v-if="tests.length > 0">
      <b-table
        ref="selectableTable"
        selectable
        select-mode="single"
        :items="answersTable"
        :fields="fields"
        :tbody-tr-class="rowClass"
        responsive="sm"
        @row-clicked="onRowSelect"
      >
        <template v-slot:cell(Действия)="{ item }">
          <b-button @click="deleteTest(item)">
            Удалить
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleTest",
  props: ["loading", "test"],
  data() {
    return {
      tests: [],
      visibleAdd: false,
      current: "",
      selectedRow: [],
      fields: [
        {
          key: "answer",
          label: "Ответ",
        },
        "Действия",
      ],
      currentId: 1,
    }
  },

  computed: {
    answersTable() {
      let result = []
      this.tests.forEach((e) => {
        result.push({
          answer: e.answer,
        })
      })
      return result
    },
    answer() {
      if (this.selectedRow.length !== 1) return false
      return this.tests.find((e) => e.answer === this.selectedRow[0].answer).id
    },
  },
  mounted() {
    this.setDefault()
  },
  methods: {
    setDefault() {
      if (this.test.type === 1) {
        this.tests = Object.assign([], this.test.answerChoice)
        this.currentId =
          this.tests.reduce((acc, curr) => (acc.id > curr.id ? acc : curr)).id +
          1
        const rightAnswerDefault = this.tests.find(
          (item) => item.id === this.test.rightAnswer
        )
        if (this.selectedRow.length === 0)
          this.selectedRow.push({ answer: rightAnswerDefault.answer })
      }
    },
    rowClass(item, type) {
      if (!item || type !== "row") return
      if (
        this.selectedRow.length === 1 &&
        item.answer === this.selectedRow[0].answer
      )
        return "table-success-row"
    },
    addAnswer() {
      if (!this.current || this.current.length === 0)
        return this.$notify.error({
          title: "Ошибка",
          message: "Варинт ответа не может быть пустым!",
          duration: 1000,
        })
      else if (this.tests.some((e) => e.answer === this.current))
        return this.$notify.error({
          title: "Ошибка",
          message: "Дублирующийся вариант ответа",
          duration: 1000,
        })

      this.tests.push({
        id: this.currentId,
        answer: this.current,
      })
      this.currentId++
      this.$notify.success({
        title: "Успех",
        message: "Тест добавлен",
        duration: 1000,
      })
    },
    save() {
      this.$emit("update-test", {
        tests: this.tests,
        answer: this.answer,
      })
    },
    deleteTest(item) {
      this.selectedRow = this.selectedRow.filter(
        (e) => e.answer !== item.answer
      )
      this.tests = this.tests.filter((e) => e.answer !== item.answer)
    },
    onRowSelect(item) {
      if (this.selectedRow.some((e) => e.answer === item.answer))
        return (this.selectedRow = [])
      if (this.selectedRow.length > 0) this.selectedRow = []
      this.selectedRow.push(item)
    },
  },
}
</script>

<style scoped></style>
