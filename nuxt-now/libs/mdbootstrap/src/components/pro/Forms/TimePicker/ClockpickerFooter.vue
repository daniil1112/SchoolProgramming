<template>
  <div class="picker__footer">
    <button type="button" class="btn btn-flat clockpicker-button" :tabindex="0" @click="handleDoneClick">{{done}}</button>
    <button type="button" class="btn btn-flat clockpicker-button" :tabindex="0" @click="handleClearClick">{{clear}}</button>
  </div>
</template>

<script>
const ClockpickerFooter = {
  props: {
    done: String,
    clear: String
  },
  methods: {
    handleDoneClick() {
      this.$emit('doneClicked', true);
    },
    handleClearClick() {
      this.$emit('clearClicked', true);
    }
  }
}; 

export default ClockpickerFooter;
</script> 
<style scoped>
  button:focus {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);    
  }
</style>