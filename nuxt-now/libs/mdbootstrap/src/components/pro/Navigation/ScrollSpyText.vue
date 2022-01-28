<template>
  <component :is="tag" :class="className">
    <slot></slot>
  </component>
</template>

<script>
const ScrollSpyText = {
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
        'scrollspy-example z-depth-1',
        this.classes
      ];
    }
  }
};

export default ScrollSpyText;
export { ScrollSpyText as mdbScrollspyText };
</script>

<style scoped>
</style>
