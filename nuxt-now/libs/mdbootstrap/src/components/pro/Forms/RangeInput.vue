<template>
  <form :class="wrapperClassName">
    <input :class="inputClassName" :min="min" :max="max" :value="localValue" type="range" v-on:input="rangeChange($event)" @focus="rangeFocus" @mouseleave="rangeMouseLeave" ref="input"/>
    <transition>
      <span v-if="thumbActive" :class="thumbClassName" :style="thumbStyle">
        <span class="value">{{localValue}}</span>
      </span>
    </transition>
    <input v-if="multi" :class="secondInputClassName" :style="secondInputStyle" :min="min" :max="max" :value="secondLocalValue" type="range" v-on:input="secondRangeChange($event)" @focus="secondRangeFocus" @mouseleave="secondRangeMouseLeave" ref="secondInput"/>
    <transition>
      <span v-if="secondThumbActive && multi" :class="secondThumbClassName" :style="secondThumbStyle">
        <span class="value">{{secondLocalValue}}</span>
      </span>
    </transition>
  </form>
</template>

<script>
const RangeInput = {
  props: {
    className: {
      type: String
    },
    secondInputClass: {
      type: String
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: [Number, String],
      default: 50
    },
    secondValue: {
      type: [Number, String],
      default: 75
    },
    wrapperClass: {
      type: String
    },
    multi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localValue: 0,
      secondLocalValue: 0,
      leftPosition: 0,
      secondLeftPosition: 0,
      thumbActive: false,
      secondThumbActive: false,
      thumbHeight: 0,
      thumbWidth: 0,
      thumbTop: '10px',
      thumbMarginLeft: '-6px',
      steps: this.max-this.min,
    };
  },
  computed: {
    inputClassName() {
      return [
        this.className
      ];
    },
    secondInputClassName() {
      return [
        'multi-range-input',
        this.secondInputClass
      ];
    },
    secondInputStyle() {
      return {
        position: 'absolute',
        left: 0,
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        boxShadow: 'none'
      }
    },
    wrapperClassName() {
      return [
        'range-field',
        this.multi && 'multi-range-field',
        this.wrapperClass
      ];
    },
    thumbClassName() {
      return [
        'thumb',
        this.thumbActive && 'active'
      ];
    },
    secondThumbClassName() {
      return [
        'thumb',
        this.secondThumbActive && 'active'
      ];
    },
    thumbStyle() {
      return {left: this.leftPosition+'px', height: this.thumbHeight, width: this.thumbWidth, top: this.thumbTop, marginLeft: this.thumbMarginLeft};
    },
    secondThumbStyle() {
      return {left: this.secondLeftPosition+'px', height: this.thumbHeight, width: this.thumbWidth, top: this.thumbTop, marginLeft: this.thumbMarginLeft};
    }
  },
  mounted() {
    this.setDefaultOffset();
    this.localValue = this.value;
    this.secondLocalValue = this.secondValue;
    if (this.multi) {
      this.$emit('getDefaultValue', this.localValue, this.secondLocalValue);
    } else {
      this.$emit('getDefaultValue', this.localValue);
    }
  },
  methods: {
    setDefaultOffset() {
      if (this.value !== 0 && this.max - this.min > 0) {
        const [inputWidth] = window.getComputedStyle(this.$refs.input).width.match(/\d*/);
        this.leftPosition = inputWidth / ((this.max - this.min)/this.value);
        if (this.multi) {
          const [secondInputWidth] = window.getComputedStyle(this.$refs.secondInput).width.match(/\d*/);
          this.secondLeftPosition = secondInputWidth / ((this.max - this.min)/this.secondValue);
        }
      }
    },
    rangeChange(e) {
      // change value:
      let newValue = e.target.value;
      this.localValue = newValue;
      let newRelativeGain = newValue-this.min;

      // operationalize the input
      let input = this.$refs.input;
      let inputWidth = input.offsetWidth;
      this.StepLength = inputWidth / this.steps;

      // thumb position offset
      let thumbOffset = 0;
      let offsetAmmount = 15;
      let distanceFromMiddle = newRelativeGain - (this.steps/2);
      thumbOffset = (distanceFromMiddle/this.steps) * offsetAmmount;

      this.leftPosition = (this.StepLength*newRelativeGain) - thumbOffset;
      if (this.multi) {
        this.$emit('getValue', this.localValue, this.secondLocalValue);
      } else {
        this.$emit('getValue', this.localValue);
      }
    },
    secondRangeChange(e) {
      // change value:
      let newValue = e.target.value;
      this.secondLocalValue = newValue;
      let newRelativeGain = newValue-this.min;

      let secondInput = this.$refs.secondInput;
      let secondInputWidth = secondInput.offsetWidth;
      this.secondStepLength = secondInputWidth / this.steps;

      // thumb position offset
      let thumbOffset = 0;
      let offsetAmmount = 15;
      let distanceFromMiddle = newRelativeGain - (this.steps/2);
      thumbOffset = (distanceFromMiddle/this.steps) * offsetAmmount;

      this.secondLeftPosition = (this.secondStepLength*newRelativeGain) - thumbOffset;
      this.$emit('getValue', this.localValue, this.secondLocalValue);
    },
    rangeFocus() {
      this.thumbActive = true;
      setTimeout(() => {
        this.thumbHeight = '30px';
        this.thumbWidth = '30px';
        this.thumbTop = '-20px';
        this.thumbMarginLeft = '-15px';
      }, 0);
    },
    secondRangeFocus() {
      this.secondThumbActive = true;
      setTimeout(() => {
        this.thumbHeight = '30px';
        this.thumbWidth = '30px';
        this.thumbTop = '-20px';
        this.thumbMarginLeft = '-15px';
      }, 0);
    },
    rangeMouseLeave() {
      let input = this.$refs.input;
      input.blur();
      this.thumbHeight = 0;
      this.thumbWidth = 0;
      this.thumbTop = '10px';
      this.thumbMarginLeft = '-6px';
      if (this.multi) {
        this.$emit('input', this.localValue, this.secondLocalValue);
      } else {
        this.$emit('input', this.localValue);
      }
      setTimeout(() => {
        this.thumbActive = false;
      }, 0);
    },
    secondRangeMouseLeave() {
      let input = this.$refs.secondInput;
      input.blur();
      this.thumbHeight = 0;
      this.thumbWidth = 0;
      this.thumbTop = '10px';
      this.thumbMarginLeft = '-6px';
      setTimeout(() => {
        this.secondThumbActive = false;
      }, 0);
    }
  },
  watch: {
    value(value) {
      this.localValue = value;
    },
    secondValue(value) {
      this.secondLocalValue = value;
    }
  }
};

export default RangeInput;
export { RangeInput as mdbRangeInput };
</script>

<style scoped>

.thumb {
  transition: top .2s, height .2s, width .2s, margin-left .2s;
}

input[type="range"] {
  -webkit-appearance: none;
}

.multi-range-field input[type="range"] {
  pointer-events: none;
}

/* thumb */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  background-color: #4285f4;
  transform-origin: 50% 50%;
  pointer-events: auto !important;
  margin: -5px 0 0 0;
  transition: 0.3s; }
input[type="range"]:focus::-webkit-slider-runnable-track {
  background: #ccc; }
input[type="range"]::-moz-range-track {
  height: 3px;
  background: #c2c0c2;
  border: none; }
input[type="range"]::-moz-range-thumb {
  border: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  pointer-events: auto !important;
  background: #4285f4;
  margin-top: -5px; }
input[type="range"]:-moz-focusring {
  outline: 1px solid #ffffff;
  outline-offset: -1px; }
input[type="range"]:focus::-moz-range-track {
  background: #c2c0c2; }
input[type="range"]::-ms-track {
  height: 3px;
  background: transparent;
  border-color: transparent;
  border-width: 6px 0;
  color: transparent; }
input[type="range"]::-ms-fill-lower {
  background: #c2c0c2; }
input[type="range"]::-ms-fill-upper {
  background: #c2c0c2; }
input[type="range"]::-ms-thumb {
  border: none;
  height: 14px;
  width: 14px;
  border-radius: 50%;
  pointer-events: auto !important;
  background: #4285f4; }
input[type="range"]:focus::-ms-fill-lower {
  background: #c2c0c2; }
input[type="range"]:focus::-ms-fill-upper {
  background: #c2c0c2; }

input[type=range].multi-range-input::-webkit-slider-runnable-track {
  background: transparent;
}
input[type=range].multi-range-input:focus::-webkit-slider-runnable-track {
  background: transparent;
}
input[type=range].multi-range-input::-moz-range-track {
  background: transparent;
}
input[type=range].multi-range-input:focus::-moz-range-track {
  background: transparent;
}


</style>
