<template>
  <div>
    <el-form ref="formAdd" :model="form" label-width="120px" :rules="rules">
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
      <el-form-item>
        <el-switch
          v-model="form.options.checkDelay"
          active-text="Проверка при закрытии"
          inactive-text="Проверять сразу"
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
  name: "AddTests",

  data() {
    return {
      validation:{
        maxAttemps: 1,
        title: 0,
        startDate: 0,
        endDate: 0
      },
      openDatePickerValue:'',
      openTimePickerValue: '',
      closeDatePickerValue:'',
      closeTimePickerValue: '',
      datePickerOptions: {
        week: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        month: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        buttons: {
          ok: 'Сохранить',
          today: 'Сегодня'
        }
      },
      form: {
        title: null,
        start: null,
        end: null,
        options: {
          checkDelay: false,
        },
      },
    }
  },

  computed:{
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
    handleOpenTimeValue(){
      return this.openDatePickerValue + ' ' + this.openTimePickerValue
    },
    handleCloseTimeValue(){
      return this.closeDatePickerValue + ' ' + this.closeTimePickerValue
    },
    validateTitle(){
      if (!this.form.title) this.validation.title = 2
      else if (this.form.title.length < 4) this.validation.title = 3
      else if (this.form.title.length > 100) this.validation.title = 4
      else this.validation.title = 1
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("addtest", {
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
  },
}
</script>

<style scoped></style>
