<template>
  <div>
    <el-button @click="(_) => (this.visibleAdd = true)">
      Добавить вариант ответа
    </el-button>
    <b-overlay
      :show="loading"
      opacity="0.6"
      spinner-small
      spinner-variant="primary"
      class="d-inline-block"
    >
      <b-button
        variant="outline-success"
        :disabled="loading || !(answers.length > 0 && tests.length > 1)"
        @click="save"
      >
        Сохранить тест
      </b-button>
      >
    </b-overlay>
    <b-form-text v-if="tests.length > 0 && selectedRows.length === 0">
      Выберте правильный(е) ответ(ы)
    </b-form-text>
    <b-form-text v-if="tests.length === 1 && selectedRows.length === 1">
      Минимальное количество вариантов ответа - 2
    </b-form-text>
    >
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
      </b-input-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="addAnswer"
          >Добавить вариант ответа</el-button
        >
        <el-button @click="(_) => (this.visibleAdd = false)">Cancel</el-button>
      </span>
    </el-dialog>
    <div v-if="tests.length > 0">
      <b-table
        ref="selectableTable"
        selectable
        select-mode="multi"
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
import eventBus from "@/plugins/eventBus"
export default {
  name: "MiltyAnswer",
  props: ["loading"],
  data() {
    return {
      type: "milty-answer",
      tests: [],
      selectedRows: [],
      visibleAdd: false,
      current: null,
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
    answers() {
      let result = []
      this.selectedRows.forEach((e) => {
        result.push(this.tests.find((test) => test.answer === e.answer).id)
      })
      return result
    },
  },

  mounted() {
    eventBus.$on("clear-create-test-teacher", (_) => {
      this.tests = []
      this.selectedRows = []
      this.currentId = 1
      this.current = null
      this.visibleAdd = false
    })
  },
  methods: {
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
    rowClass(item, type) {
      if (!item || type !== "row") return
      if (this.selectedRows.some((e) => e.answer === item.answer))
        return "table-success-row"
    },
    save() {
      this.$emit("save-test", {
        type: this.type,
        tests: this.tests,
        answer: this.answers,
      })
    },
    deleteTest(item) {
      this.tests = this.tests.filter((e) => e.answer !== item.answer)
      this.selectedRows = this.selectedRows.filter(
        (e) => e.answer !== item.answer
      )
    },
    onRowSelect(item) {
      if (this.selectedRows.some((e) => e.answer === item.answer))
        this.selectedRows = this.selectedRows.filter(
          (e) => e.answer !== item.answer
        )
      else this.selectedRows.push(item)
    },
  },
}
</script>

<style scoped></style>
