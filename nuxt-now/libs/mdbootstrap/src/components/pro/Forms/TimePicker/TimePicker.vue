<template>
  <div class="md-form">
    <mdb-input
      type="text"
      v-show="!disableInput"
      :placeholder="placeholder"
      :id="id"
      :class="`timepicker ${pickerDialogOpen ? 'picker__input picker__input--active' : ''}`"
      :value="innerValue"
      @click="handlePickerDialogToggle"
      @keydown.stop.enter="handlePickerDialogToggle"
      :icon="icon"
      :iconClass="iconClass"
      :label="label"
      :far="far"
      :bg="bg"
      :fal="fal"
      :fab="fab"
      :outline="outline"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <transition name="fade" mode="out-in">
      <div v-if="pickerDialogOpen" class="clockpicker picker picker--opened">
        <div class="picker__holder">
          <div class="picker__frame">
            <div class="picker__wrap">
              <div class="picker__box" v-on-clickaway="away">
                <time-display :hours="computedHours" :color="color" :minutes="computedMinutes" :dayTime="dayTime" :unitsMode="unitsMode" @unitsMode="handleModeChange" :hoursFormat="hoursFormat" />
                <clockpicker-plate
                  @minutes="handleMinutesChange"
                  @hours="handleHoursChange"
                  @change="handleModeChange"
                  :hours="hours"
                  :minutes="minutes"
                  :unitsMode="computedMode"
                  :color="color"
                  :hoursFormat="hoursFormat"
                />
                <clockpicker-am-pm-block v-if="hoursFormat === 12" @dayTime="handleDayTimeChange" />
                <clockpicker-footer @doneClicked="handleDoneClicked" @clearClicked="handleClearClicked" :done="doneLabel" :clear="clearLabel" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import TimeDisplay from './TimeDisplay';
import ClockpickerPlate from './ClockpickerPlate';
import ClockpickerAmPmBlock from './ClockpickerAmPmBlock';
import ClockpickerFooter from './ClockpickerFooter';
import { mixin as clickaway } from 'vue-clickaway';
import mdbInput from '../../../Forms/Input';

const TimePicker = {
  props: {
    color: {
      type: String,
      default: 'primary-color'
    },
    placeholder: {
      type: String
    },
    id: {
      type: [String, Boolean],
      default: false
    },
    label: {
      type: String
    },
    hoursFormat: {
      type: Number,
      default: 12
    },
    getValue: {
      type: Function
    },
    doneLabel: {
      type: String,
      default: 'Done'
    },
    clearLabel: {
      type: String,
      default: 'Clear'
    },
    icon: String,
    iconClass: String,
    far: Boolean,
    fab: Boolean,
    fal: Boolean,
    outline: Boolean,
    bg: Boolean,
    value: {
      type: String
    },
    disableInput: {
      type: Boolean
    }
  },
  components: {
    TimeDisplay,
    ClockpickerPlate,
    ClockpickerAmPmBlock,
    ClockpickerFooter,
    mdbInput
  },
  data() {
    return {
      innerValue: this.value,
      pickerDialogOpen: false ,
      unitsMode: 'h',
      dayTime: 'am',
      minutes: 0,
      hours: 12,
      ready: false
    };
  },
  mixins: [clickaway],
  computed: {
    computedMinutes () {
      return this.minutes < 10 ? `0${this.minutes.toString()}` : `${this.minutes.toString()}`;
    },
    computedHours () {
      return this.hours < 10 ? `0${this.hours.toString()}` : this.hours === 24 ? `00` : `${this.hours.toString()}`;
    },
    computedMode () {
      return this.unitsMode;
    }
  },
  methods: {
    handlePickerDialogToggle () {
      this.pickerDialogOpen = !this.pickerDialogOpen;
    },
    handleModeChange (mode) {
      this.unitsMode = mode;
    },
    handleDayTimeChange (dayTime) {
      this.dayTime = dayTime;
    },
    handleMinutesChange (minutes) {
      this.minutes = minutes;
      this.ready = true;
    },
    handleHoursChange (hours) {
      this.hours = hours;
    },
    handleDoneClicked() {
      this.innerValue = this.hoursFormat === 12 ? `${this.computedHours}:${this.computedMinutes}${this.dayTime}` : `${this.computedHours}:${this.computedMinutes}`;
      this.unitsMode = 'h';
      this.emitValue(this.innerValue);
      this.handlePickerDialogToggle();
      this.$emit('close');
    },
    handleClearClicked() {
      this.innerValue = '';
      this.unitsMode = 'h';
      this.emitValue(this.innerValue);
      this.handlePickerDialogToggle();
    },
    emitValue(innerValue) {
      this.$emit('input', innerValue);
      this.$emit('getValue', innerValue);
    },
    away() {
      this.$emit('close');
      this.pickerDialogOpen = false;
    },
    handleKeyup(e){
      switch (e.keyCode) {
        case 8:
          this.unitsMode = 'h';
          break;
        case 13:
          if (this.ready){
            this.handleDoneClicked();
            this.ready = false;
          }
          break;
        case 27:
          this.pickerDialogOpen = false;
          break;
      }
    },
    open() {
      this.pickerDialogOpen = true;
    },
    clear() {
      this.handleClearClicked();
      this.away();
    }
  },
  mounted() {
    if (this.innerValue) {
      if (this.hoursFormat === 12) {
        this.hours = parseInt(this.innerValue.split(':')[0])
        this.minutes = parseInt(this.innerValue.split(':')[1])
        this.handleDayTimeChange(this.innerValue.split(':')[1].replace(/[0-9]/g, '').toString())
      } else {
        this.hours = parseInt(this.innerValue.split(':')[0])
        this.minutes = parseInt(this.innerValue.split(':')[1])
      }
    }
  },
  updated(){
    if (this.pickerDialogOpen){
      setTimeout(() => window.addEventListener('keyup', this.handleKeyup), 800);
    }
    else {
      window.removeEventListener('keyup', this.handleKeyup);
    }
  }
};

export default TimePicker;
export { TimePicker as mdbTimePicker };
</script>