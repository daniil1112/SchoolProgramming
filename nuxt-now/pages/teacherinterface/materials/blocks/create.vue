<template>
  <el-card shadow="always">
    <el-input v-model="title" placeholder="Заголовок" />
    <el-table v-if="tests" :data="tests">
      <el-table-column label="Id" prop="_id" />
      <el-table-column label="Заголовок" prop="title" />
      <el-table-column>
        <template slot-scope="scope">
          <el-button v-if="!check(scope)" @click="addTest(scope)">
            Добавить тест
          </el-button>
          <el-button v-else @click="removeTest(scope)">
            Убрать тест
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button v-if="chosen.length > 0" @click="save">
      Сохранить блок
    </el-button>
  </el-card>
</template>

<script>
export default {
  name: "Create",
  layout: "teacher",
  middleware: "authTeacher",

  data() {
    return {
      page: 1,
      tests: [],
      chosen: [],
      title: null,
    }
  },

  async mounted() {
    const tests = await this.$axios.post(
      "https://server-now.moiplansh028.now.sh/api/teacher/tests/allTests",
      {
        page: this.page,
      }
    )

    if (tests.data.tests) this.tests = tests.data.tests
  },

  methods: {
    addTest({ row }) {
      this.chosen.push(row._id)
    },
    removeTest({ row }) {
      this.chosen = this.chosen.filter((element) => element !== row._id)
    },
    check({ row }) {
      return this.chosen.some((element) => element === row._id)
    },
    async save() {
      if (!this.title)
        this.$notify.error({
          title: "Ошибка",
          text: "Заголовок не может быть пустым",
          showClose: true,
        })
      else if (this.chosen.length < 0)
        this.$notify.error({
          title: "Ошибка",
          text: "Не выбраны тесты",
          showClose: true,
        })
      else {
        const result = await this.$axios.post(
          "https://server-now.moiplansh028.now.sh/api/teacher/tests/createblock",
          {
            title: this.title,
            tests: this.chosen,
          }
        )

        console.log(result.data)

        if (result.data.result) {
          this.$notify.success({
            title: "Успех",
            text: "Блок тестов успешно создан",
            showClose: true,
          })
        }
      }
    },
  },
}
</script>

<style scoped></style>
