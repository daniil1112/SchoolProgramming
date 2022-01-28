<template>
  <div>
    <el-form ref="formAdd" :model="form" label-width="120px">
      <mdb-input
          icon="align-justify"
          v-model="form.title"
          label="Заголовок"
          @change="validateTitle"
          :customValidation="validation.title > 0"
          :isValid="validation.title === 1"
          :invalidFeedback="invalidTitleFeedback"
      />

      <mdb-input
          icon="clock"
          :value="handleOpenTimeValue()"
          @click.native="$refs.datePicker.open()"
          label="Время открытия"
          @change="validateStartDate"
          :customValidation="validation.startDate > 0"
          :isValid="validation.startDate === 1"
          :invalidFeedback="invalidStartDateFeedback"
      />
      <mdb-date-picker
          ref="datePicker"
          :option="datePickerOptions"
          disableClear
          disabledPast
          disable-input
          v-model="openDatePickerValue"
          @ok="openDatePickerOk" />
      <mdb-time-picker
          :hoursFormat="24"
          ref="timePicker"
          disable-input
          v-model="openTimePickerValue" />
      <mdb-input
          icon="clock"
          :value="handleCloseTimeValue()"
          @click.native="$refs.datePickerClose.open()"
          label="Время закрытия"
          @change="validateEndDate"
          :customValidation="validation.endDate > 0"
          :isValid="validation.endDate === 1"
          :invalidFeedback="invalidEndDateFeedback"

      />
      <mdb-date-picker
          ref="datePickerClose"
          :option="datePickerOptions"
          disableClear
          disabledPast
          disable-input
          v-model="closeDatePickerValue"
          @ok="closeDatePickerOk" />
      <mdb-time-picker
          :hoursFormat="24"
          ref="timePickerClose"
          disable-input
          v-model="closeTimePickerValue" />
      <mdb-input
          type="number"
          :min="1"
          :max="200"
          label="Максимальное количество попыток"
          v-model="form.options.maxAttemps"
          @change="validateMaxAttemps"
          :customValidation="validation.maxAttemps > 0"
          :isValid="validation.maxAttemps === 1"
          :invalidFeedback="invalidMaxAttempsFeedback"
      />
      <mdb-switch
        offLabel="Разрешение доработки после решения"
        onLabel="Запрет доработки после решения"
        v-model="form.options.onlyOneSuccessAttemp"
      />
      <mdb-switch
          offLabel="Не показывать"
          onLabel="Показывать таблицу с тестами"
          v-model="form.options.visibleTestsTable"
      />
      <mdb-switch
          offLabel="Не показывать"
          onLabel="Показывать ответ компилятора на каждый тест"
          v-model="form.options.visibleCompilerAnswer"
          :disabled="!form.options.visibleTestsTable"
      />
      <mdb-switch
          offLabel="Не показывать вход/выход теста"
          onLabel="Показывать вход/выход теста"
          v-model="form.options.visibleTests"
          :disabled="!form.options.visibleTestsTable"
      />
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
  name: "AddProgramming",

  data() {
    return {
      openDatePickerValue:'',
      openTimePickerValue: '',
      closeDatePickerValue:'',
      closeTimePickerValue: '',
      form: {
        title: null,
        start: null,
        end: null,
        options: {
          onlyOneSuccessAttemp: false,
          visibleTests: false,
          visibleCompilerAnswer: true,
          visibleTestsTable: true,
          maxAttemps: 100,
        },
      },
      validation:{
        maxAttemps: 1,
        title: 0,
        startDate: 0,
        endDate: 0
      },
      datePickerOptions: {
        week: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        month: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        buttons: {
          ok: 'Сохранить',
          today: 'Сегодня'
        }
      },
    }
  },

  computed:{
    invalidMaxAttempsFeedback(){
      if (this.validation.maxAttemps === 2 ) return 'Введите кол-во попыток'
      if (this.validation.maxAttemps === 3 ) return 'Кол-во попыток должно быть 1 или более'
      if (this.validation.maxAttemps === 4 ) return 'Кол-во попыток должно быть 200 или менее '
    },
    invalidStartDateFeedback(){
      if (this.validation.startDate === 2 ) return 'Введите дату'
      if (this.validation.startDate === 3 ) return 'Дата неверная'
    },
    invalidEndDateFeedback(){
      if (this.validation.endDate === 2 ) return 'Введите дату'
      if (this.validation.endDate === 3 ) return 'Дата неверная'
    },
    invalidTitleFeedback(){
      if (this.validation.title === 2) return 'Введите заголовок'
      if (this.validation.title === 3) return 'Слишком короткий заголовок'
      if (this.validation.title === 4) return 'Слишком длинный заголовок'
    }
  },

  methods: {
    handleOpenTimeValue(){
      return this.openDatePickerValue + ' ' + this.openTimePickerValue
    },
    handleCloseTimeValue(){
      return this.closeDatePickerValue + ' ' + this.closeTimePickerValue
    },
    validateStartDate(){
      if (!this.openDatePickerValue || !this.openTimePickerValue) this.validation.startDate = 2
      else if (!(new Date(this.handleOpenTimeValue()))) this.validation.startDate = 3
      else this.validation.startDate = 1
    },
    validateEndDate(){
      if (!this.closeDatePickerValue || !this.closeTimePickerValue) this.validation.endDate = 2
      else if (!(new Date(this.handleCloseTimeValue()))) this.validation.endDate = 3
      else this.validation.endDate = 1
    },
    validateTitle(){
      if (!this.form.title) this.validation.title = 2
      else if (this.form.title.length < 4) this.validation.title = 3
      else if (this.form.title.length > 100) this.validation.title = 4
      else this.validation.title = 1
    },
    openDatePickerOk(){
      if (this.openDatePickerValue && new Date(this.openDatePickerValue)) this.$refs.timePicker.open()
      else {
        this.$refs.datePicker.open()
        this.$notify.error({
          title: 'Выберите дату'
        })
      }
    },
    closeDatePickerOk(){
      if (this.closeDatePickerValue && new Date(this.closeDatePickerValue)) this.$refs.timePickerClose.open()
      else {
        this.$refs.datePickerClose.open()
        this.$notify.error({
          title: 'Выберите дату'
        })
      }
    },
    validateForm(){
      this.validateMaxAttemps()
      this.validateStartDate()
      this.validateEndDate()
      this.validateTitle()
      return this.validation.maxAttemps === 1 && this.validation.startDate === 1 && this.validation.endDate === 1 && this.validation.title === 1
    },
    save(formName) {
      if (!this.validateForm()) return this.$notify.error({
        title: 'Ошика при сохранении',
        message: 'Проверьте введенные поля'
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("addprogramming", {
            title: this.form.title,
            start: new Date(this.handleOpenTimeValue()).toString(),
            end: new Date(this.handleCloseTimeValue()).toString(),
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
    visibleTableChange(){
      if (!this.form.options.visibleTestsTable) {
        this.form.options.visibleTests = false;
        this.form.options.visibleCompilerAnswer = false
      } else {
        this.form.options.visibleTests = false;
        this.form.options.visibleCompilerAnswer = true;
      }
    },
    validateMaxAttemps(){
      let maxAttemps = this.form.options.maxAttemps
      if (!maxAttemps) this.validation.maxAttemps = 2
      else if (maxAttemps < 1) this.validation.maxAttemps = 3
      else if (maxAttemps > 200) this.validation.maxAttemps = 4
      else this.validation.maxAttemps = 1
    }
  },
}
</script>

<style scoped></style>
