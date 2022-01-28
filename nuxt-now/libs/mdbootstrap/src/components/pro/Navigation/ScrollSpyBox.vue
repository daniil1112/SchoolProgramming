<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script>
const ScrollSpyBox = {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    classes: {
      type: String
    }
  },
  computed: {
    className() {
      return [
        'scroll-box',
        this.classes
      ];
    }
  }
};

export default ScrollSpyBox;
export { ScrollSpyBox as mdbScrollspyBox };
</script>

<style scoped>
</style>
