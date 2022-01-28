<template>
  <div>
    <mdb-btn tag="a" gradient="green" floating size="lg" @click="modal = true"><mdb-icon icon="plus"/></mdb-btn>
    <mdb-container>
      <mdb-modal :show="modal" @close="modal = false">
        <mdb-modal-header center>Добавление примера</mdb-modal-header>
        <mdb-modal-body>
          <mdb-row>
            <mdb-col sm="6">
              <mdb-input
                      type="textarea"
                      label="Входные параметры"
                      v-model="currentInput"
                      @change="currentInput.trim()"
              />
            </mdb-col>
            <mdb-col sm="6">
              <mdb-input
                      type="textarea"
                      label="Выходные параметры"
                      v-model="currentOutput"
                      @change="currentOutput.trim()"
              />
            </mdb-col>
          </mdb-row>
          <mdb-modal-footer center>
            <mdb-btn gradient="blue" rounded @click="addExample">Добавить</mdb-btn>
          </mdb-modal-footer>
        </mdb-modal-body>
      </mdb-modal>
    </mdb-container>
    <mdb-container>
      <mdb-container>
        <mdb-tbl striped v-if="examples.length>0">
          <mdb-tbl-head>
            <tr>
              <th>#</th>
              <th>Пример ввода</th>
              <th>Пример вывода</th>
              <th></th>
            </tr>
          </mdb-tbl-head>
          <mdb-tbl-body>
            <tr v-for="(example,index) in examples">
              <th>{{index+1}}</th>
              <td>{{example.input}}</td>
              <td>{{example.output}}</td>
              <td><mdb-btn tag="a" gradient="blue" floating size="sm" @click="examples.splice(index, 1)"><mdb-icon icon="trash-alt"/></mdb-btn></td>
            </tr>
          </mdb-tbl-body>
        </mdb-tbl>
      </mdb-container>
    </mdb-container>
  </div>
</template>

<script>
export default {
  name: "Examples",

  data() {
    return {
      currentInput: "",
      currentOutput: "",
      examples: [],
      modal:false
    }
  },

  watch:{
    examples: function () {
      this.$emit('examples',this.examples)
    }
  },

  methods: {
    addExample() {
      if (this.currentInput.length === 0)
        return this.$notify.error({
          title: "Ошибка",
          message: "Ввод не может быть пустым",
        })
      if (this.currentOutput.length === 0)
        return this.$notify.error({
          title: "Ошибка",
          message: "Вывод не может быть пустым",
        })
      if (this.examples.some((e) => e.input === this.currentInput))
        return this.$notify.error({
          title: "Ошибка",
          message: "Дублирующийся ввод",
        })
      this.examples.push({
        input: this.currentInput,
        output: this.currentOutput,
      })
      this.currentInput = ""
      this.currentOutput = ""
    },
  },
}
</script>

<style scoped>
.font-size-12 {
  font-size: 12px;
}
</style>
