<template>
  <div>
    <el-form ref="formAdd" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="Заголовок" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Время открытия" prop="start">
        <el-date-picker
          v-model="form.start"
          type="datetime"
          placeholder="Select date and time"
          :picker-options="pickerOptionsStart"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="save('formAdd')">
          Сохранить
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "AddMaterial",

  data() {
    return {
      form: {
        title: null,
        start: null,
        end: null,
        options: {
          checkDelay: false,
          visibleTests: false,
          visibleCompilerAnswer: true,
        },
      },
      pickerOptionsStart: {
        shortcuts: [
          {
            text: "Now",
            onClick(picker) {
              picker.$emit("pick", new Date())
            },
          },
        ],
      },
      pickerOptionsEnd: {
        shortcuts: [
          {
            text: "Now",
            onClick(picker) {
              picker.$emit("pick", new Date())
            },
          },
          {
            text: "Tomorrow",
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit("pick", date)
            },
          },
        ],
      },
      rules: {
        title: [
          { required: true, message: "Введите название", trigger: "blur" },
          {
            min: 2,
            message: "Название должно быть не короче 2 символов",
            trigger: "blur",
          },
          {
            max: 50,
            message: "Название должно быть не длиннее 50 символов",
            trigger: "blur",
          },
        ],
        start: [
          {
            required: true,
            message: "Введите время начала выполнения",
            trigger: "blur",
          },
        ],
      },
    }
  },

  methods: {
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("addmaterial", {
            title: this.form.title,
            start: parseInt(
              new Date(this.form.start.toISOString()).getTime() / 1000
            ),
            end: 9999999999,
            options: this.form.options,
          })
        } else {
          this.$notify.error({
            title: "Ошибка при создании",
            message: "Заполните все поля!",
          })
        }
      })
    },
  },
}
</script>

<style scoped></style>
