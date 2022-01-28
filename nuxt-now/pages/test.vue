<template>
   <div>
       <div>
           <mdb-input :value="handlePickersValue()" @click.native.prevent="$refs.datePicker.open()" />
           <mdb-date-picker
                   disabledPast
                   ref="datePicker"
                   disable-input
                   v-model="datePickerValue"
                   @ok="$refs.timePicker.open()" />
           <mdb-time-picker
                   ref="timePicker"
                   disable-input
                   :hours-format="24"
                   v-model="timePickerValue"
           />
       </div>
   </div>
</template>


<script>
    export default {
        name: 'DatePickerPage',

        methods: {
            handlePickersValue() {
                let output = 'Pick date and time'
                if (this.datePickerValue && this.timePickerValue) output = `${this.datePickerValue}, ${this.timePickerValue}`
                else if (this.datePickerValue) output = this.datePickerValue
                else if (this.timePickerValue) output = this.timePickerValue
                return output

            }
        },
        data() {
                return {
                datePickerValue: '',
                timePickerValue: ''
            }
        }
    }
</script>

<style scoped>

</style>