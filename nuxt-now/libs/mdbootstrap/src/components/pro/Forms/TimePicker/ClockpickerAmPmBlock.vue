<template>
  <div class="clockpicker-am-pm-block">
    <button :tabindex="0" type="button" :class="`btn-floating btn-flat clockpicker-button am-button ${dayTime === 'am' ? 'active' : ''}`" @click="changeDayTime('am')">AM</button>
    <button :tabindex="0" type="button" :class="`btn-floating btn-flat clockpicker-button pm-button ${dayTime === 'pm' ? 'active' : ''}`" @click="changeDayTime('pm')">PM</button>
  </div>
</template>

<script>
const ClockpickerAmPmBlock = {
  data() {
    return {
      dayTime: 'am'
    };
  },
  methods: {
    changeDayTime(time) {
      this.dayTime = time;
      this.$emit('dayTime', this.dayTime);
    }
  }
};

export default ClockpickerAmPmBlock;
</script>
<style scoped>
  .active:focus {
    box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.38), 0 4px 15px 0 rgba(0, 0, 0, 0.35)!important;
  }
</style>