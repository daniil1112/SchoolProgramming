<template>
  <div :class="className">
    <label>
      {{offLabel}}
      <input :disabled="disabled" type="checkbox" v-model="toggle">
      <span class="lever"></span>
      {{onLabel}}
    </label>
  </div>
</template>

<script>
const MdSwitch = {
  props: {
    offLabel: {
      type: String,
      default: "Off"
    },
    checked: {
      type: Boolean
    },
    onLabel: {
      type: String,
      default: "On"
    },
    disabled: {
      type: Boolean
    },
    classes: {
      type: String
    },
    value: {
      type: Boolean
    }
  },
  mounted() {
    this.$emit("getDefaultValue", this.toggle);
  },
  computed: {
    className() {
      return ["switch", this.classes];
    },
    toggle: {
      get() {
        return this.value || this.checked;
      },
      set(value) {
        this.$emit("getValue", value);
        this.$emit("input", value);
      }
    }
  }
};

export default MdSwitch;
export { MdSwitch as mdbSwitch };
</script>

<style scoped>
</style>
