<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script>
const ScrollSpyList = {
  props: {
    tag: {
      type: String,
      default: "ul"
    },
    color: {
      type: String
    }
  },
  computed: {
    className() {
      return [
        'nav nav-tabs md-tabs horizontal-spy',
        this.color ? this.color : false
      ];
    }
  }
};

export default ScrollSpyList;
export { ScrollSpyList as mdbScrollspyList };
</script>

<style scoped>
</style>
