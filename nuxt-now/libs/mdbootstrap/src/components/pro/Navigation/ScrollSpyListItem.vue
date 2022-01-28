<template>
  <component :is="tag" class="nav-item">
    <a :class="className" href="#" role="tab">
      <slot></slot>
    </a>
  </component>
</template>

<script>
const ScrollSpyListItem = {
  props: {
    tag: {
      type: String,
      default: "li"
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      return [
        'nav-link',
        this.active && 'active'
      ];
    }
  }
};

export default ScrollSpyListItem;
export { ScrollSpyListItem as mdbScrollspyListItem };
</script>

<style scoped>
</style>
